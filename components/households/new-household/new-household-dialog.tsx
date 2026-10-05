"use client";

import { useRef, useState, type FormEvent } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import { Checkbox } from "@/components/_ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/_ui/dialog";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import { Slider } from "@/components/_ui/slider";
import SegmentBar from "@/components/_common/segment-bar";
import FormSection from "./form-section";
import {
  ADVISORS,
  HOUSEHOLD_TAGS,
  NEW_TREND,
  PROSPECT_STAGES,
  TIERS,
  type Household,
  type HouseholdTag,
  type OpportunityStage,
  type Person,
  type Tier,
} from "@/data/households";
import { TODAY, addMonths, householdName } from "@/lib/households";
import { cn, slugify } from "@/lib/utils";
import {
  useHouseholdsStore,
  type NewHouseholdType,
} from "@/stores/households-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

type PartnerRole = "Spouse" | "Partner";

type FormState = {
  tier: Tier;
  advisor: string;
  tags: HouseholdTag[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  partnerFirstName: string;
  partnerLastName: string;
  partnerRole: PartnerRole;
  withOpportunity: boolean;
  stage: OpportunityStage;
  value: string;
  probability: number;
  targetClose: string;
};

const EMPTY_FORM: FormState = {
  tier: "C",
  advisor: ADVISORS[0].name,
  tags: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  partnerFirstName: "",
  partnerLastName: "",
  partnerRole: "Spouse",
  withOpportunity: true,
  stage: PROSPECT_STAGES[0].value,
  value: "",
  probability: PROSPECT_STAGES[0].probability,
  targetClose: addMonths(TODAY, 1),
};

const TYPE_OPTIONS: NewHouseholdType[] = ["Client", "Prospect"];

export default function NewHouseholdDialog() {
  const open = useHouseholdsStore((state) => state.newHouseholdOpen);
  const setOpen = useHouseholdsStore((state) => state.setNewHouseholdOpen);
  const type = useHouseholdsStore((state) => state.newHouseholdType);
  const setType = useHouseholdsStore((state) => state.setNewHouseholdType);
  const addHousehold = useHouseholdsStore((state) => state.addHousehold);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [nameError, setNameError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const isProspect = type === "Prospect";
  const createOpportunity = isProspect && form.withOpportunity;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: HouseholdTag) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
  }

  function changeStage(stage: OpportunityStage) {
    const probability =
      PROSPECT_STAGES.find((item) => item.value === stage)?.probability ?? 10;
    setForm((current) => ({ ...current, stage, probability }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    if (!firstName && !email) {
      setNameError("Enter a first name or an email address.");
      nameRef.current?.focus();
      return;
    }

    const id = `${slugify(lastName || firstName || email)}-${Date.now()}`;
    const head: Person = {
      id: `${id}-head`,
      firstName: firstName || email.split("@")[0],
      lastName,
      role: "Head of household",
      email: email || undefined,
      phone: form.phone.trim() || undefined,
      maritalStatus: form.partnerFirstName.trim()
        ? form.partnerRole === "Spouse"
          ? "Married"
          : "Partnered"
        : undefined,
    };
    const partnerFirstName = form.partnerFirstName.trim();
    const partner: Person | null = partnerFirstName
      ? {
          id: `${id}-partner`,
          firstName: partnerFirstName,
          lastName: form.partnerLastName.trim() || lastName,
          role: form.partnerRole,
          maritalStatus: form.partnerRole === "Spouse" ? "Married" : "Partnered",
        }
      : null;

    const value = Math.max(0, Math.round(Number(form.value) || 0));
    const name = householdName(head, partner ?? undefined);

    const household: Household = {
      id,
      name,
      type,
      tier: isProspect ? null : form.tier,
      tags: form.tags,
      advisor: form.advisor,
      people: partner ? [head, partner] : [head],
      accounts: [],
      opportunities: createOpportunity
        ? [
            {
              id: `${id}-opportunity`,
              name: `${lastName || name} new relationship`,
              stage: form.stage,
              value,
              probability: form.probability,
              targetClose: form.targetClose || addMonths(TODAY, 1),
            },
          ]
        : [],
      meetings: [],
      clientSince: isProspect ? null : TODAY,
      lastReview: null,
      lastTouchpoint: { date: TODAY, label: "Added" },
      touchpointTrend: NEW_TREND,
      touchpointMix: { meetings: 0, emails: 0, calls: 0, notes: 0 },
    };

    addHousehold(household);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[560px]"
        onCloseAutoFocus={() => {
          setForm(EMPTY_FORM);
          setNameError(null);
        }}
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <DialogHeader>
            <DialogTitle>New Household</DialogTitle>
            <DialogDescription>
              Add a client or prospect household. It appears in the book right
              away.
            </DialogDescription>
          </DialogHeader>

          <FormSection title="Household">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type" htmlFor="household-type">
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as NewHouseholdType)}
                >
                  <SelectTrigger id="household-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {isProspect ? (
                <div aria-hidden className="hidden sm:block" />
              ) : (
                <Field label="Service tier" htmlFor="household-tier">
                  <Select
                    value={form.tier}
                    onValueChange={(value) => update("tier", value as Tier)}
                  >
                    <SelectTrigger id="household-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          Tier {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>

            <Field label="Lead advisor" htmlFor="household-advisor">
              <Select
                value={form.advisor}
                onValueChange={(value) => update("advisor", value)}
              >
                <SelectTrigger id="household-advisor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADVISORS.map((advisor) => (
                    <SelectItem key={advisor.name} value={advisor.name}>
                      <span className="flex items-center gap-2">
                        <Avatar src={advisor.avatar} alt="" />
                        {advisor.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="flex flex-col gap-2">
              <span className="caption-style text-soft block">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {HOUSEHOLD_TAGS.map((tag) => {
                  const active = form.tags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      variant={active ? "muted" : "ghost"}
                      size="sm"
                      aria-pressed={active}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "font-normal",
                        !active && "shadow-[0px_0px_0px_1px_#333333]",
                      )}
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
            </div>
          </FormSection>

          <FormSection title="Head of household">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                htmlFor="head-first-name"
                required
                error={nameError ?? undefined}
              >
                <Input
                  ref={nameRef}
                  id="head-first-name"
                  value={form.firstName}
                  onChange={(event) => {
                    update("firstName", event.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="John"
                  autoComplete="off"
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={
                    nameError ? "head-first-name-error" : undefined
                  }
                  className="aria-invalid:border-danger"
                  autoFocus
                />
              </Field>
              <Field label="Last name" htmlFor="head-last-name">
                <Input
                  id="head-last-name"
                  value={form.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                  placeholder="Smith"
                  autoComplete="off"
                />
              </Field>
              <Field label="Email" htmlFor="head-email">
                <Input
                  id="head-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    update("email", event.target.value);
                    if (nameError) setNameError(null);
                  }}
                  placeholder="john.smith@example.com"
                  autoComplete="off"
                />
              </Field>
              <Field label="Phone" htmlFor="head-phone">
                <Input
                  id="head-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="+1 (415) 555-0100"
                  autoComplete="off"
                  className="tabular-nums"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Spouse or partner">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="First name" htmlFor="partner-first-name">
                <Input
                  id="partner-first-name"
                  value={form.partnerFirstName}
                  onChange={(event) =>
                    update("partnerFirstName", event.target.value)
                  }
                  placeholder="Jane"
                  autoComplete="off"
                />
              </Field>
              <Field label="Last name" htmlFor="partner-last-name">
                <Input
                  id="partner-last-name"
                  value={form.partnerLastName}
                  onChange={(event) =>
                    update("partnerLastName", event.target.value)
                  }
                  placeholder={form.lastName || "Smith"}
                  autoComplete="off"
                />
              </Field>
              <Field label="Role" htmlFor="partner-role">
                <Select
                  value={form.partnerRole}
                  onValueChange={(value) =>
                    update("partnerRole", value as PartnerRole)
                  }
                >
                  <SelectTrigger id="partner-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          {isProspect && (
            <FormSection title="Opportunity">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="household-opportunity"
                  checked={form.withOpportunity}
                  onCheckedChange={(checked) =>
                    update("withOpportunity", checked === true)
                  }
                />
                <Label htmlFor="household-opportunity">
                  Also create an opportunity
                </Label>
              </div>

              {form.withOpportunity && (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Stage" htmlFor="opportunity-stage">
                      <Select
                        value={form.stage}
                        onValueChange={(value) =>
                          changeStage(value as OpportunityStage)
                        }
                      >
                        <SelectTrigger id="opportunity-stage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROSPECT_STAGES.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Expected assets" htmlFor="opportunity-value">
                      <div className="relative">
                        <span
                          aria-hidden
                          className="text-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] leading-none"
                        >
                          $
                        </span>
                        <Input
                          id="opportunity-value"
                          type="number"
                          min={0}
                          step={50000}
                          inputMode="numeric"
                          value={form.value}
                          onChange={(event) =>
                            update("value", event.target.value)
                          }
                          placeholder="1500000"
                          className="pl-6 tabular-nums"
                        />
                      </div>
                    </Field>
                    <Field label="Target close" htmlFor="opportunity-close">
                      <Input
                        id="opportunity-close"
                        type="date"
                        min={TODAY}
                        value={form.targetClose}
                        onChange={(event) =>
                          update("targetClose", event.target.value)
                        }
                        className="tabular-nums"
                      />
                    </Field>
                  </div>

                  <Field
                    label="Probability"
                    htmlFor="opportunity-probability"
                    trailing={
                      <span className="caption-style text-foreground tabular-nums">
                        {form.probability}%
                      </span>
                    }
                  >
                    <div className="flex flex-col gap-3">
                      <Slider
                        id="opportunity-probability"
                        aria-label="Probability"
                        min={0}
                        max={100}
                        step={1}
                        value={[form.probability]}
                        onValueChange={([value]) =>
                          update("probability", value)
                        }
                      />
                      <SegmentBar
                        percent={form.probability}
                        segments={40}
                        className="h-3 w-full border border-white/4 px-px"
                        segmentClassName="h-2"
                        trackClassName="bg-white/8"
                      />
                    </div>
                  </Field>
                </>
              )}
            </FormSection>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="subtle" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" size="sm" type="submit">
              <PlusIcon aria-hidden className="size-3" />
              Create {isProspect ? "Prospect" : "Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
