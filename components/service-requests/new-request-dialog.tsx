"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/_ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import FormSection from "@/components/households/new-household/form-section";
import { RoleTag } from "./request-tags";
import {
  MONEY_CATEGORIES,
  REQUEST_CATEGORIES,
  REQUEST_TEMPLATES,
  requestTemplate,
} from "@/data/request-templates";
import { OPERATIONS_TEAM } from "@/data/service-requests";
import { addBusinessDays } from "@/lib/business-days";
import { TODAY, formatDate } from "@/lib/households";
import { createRequest } from "@/lib/service-requests";
import { useHouseholdsStore } from "@/stores/households-store";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

const FULL_ACCOUNT_NUMBER = /\d{6,}/;

export default function NewRequestDialog() {
  const open = useHouseholdsStore((state) => state.newRequestOpen);
  const setOpen = useHouseholdsStore((state) => state.setNewRequestOpen);
  const presetHousehold = useHouseholdsStore(
    (state) => state.newRequestHouseholdId,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px]">
        {open && <NewRequestForm presetHousehold={presetHousehold} />}
      </DialogContent>
    </Dialog>
  );
}

function NewRequestForm({
  presetHousehold,
}: {
  presetHousehold: string | null;
}) {
  const households = useHouseholdsStore((state) => state.households);
  const serviceRequests = useHouseholdsStore((state) => state.serviceRequests);
  const addServiceRequest = useHouseholdsStore(
    (state) => state.addServiceRequest,
  );
  const [templateKey, setTemplateKey] = useState(REQUEST_TEMPLATES[0].key);
  const [householdId, setHouseholdId] = useState(presetHousehold ?? "");
  const [accountRef, setAccountRef] = useState("");
  const [amount, setAmount] = useState("");
  const [owner, setOwner] = useState(OPERATIONS_TEAM[0]);
  const [householdError, setHouseholdError] = useState<string | null>(null);

  const template = requestTemplate(templateKey) ?? REQUEST_TEMPLATES[0];
  const eligible = households
    .filter((household) => household.type !== "Past client")
    .sort((a, b) => a.name.localeCompare(b.name));
  const household = households.find((item) => item.id === householdId);
  const showAmount =
    MONEY_CATEGORIES.includes(template.category) ||
    template.key === "rollover-401k" ||
    template.key === "life-insurance-app";
  const accountError = FULL_ACCOUNT_NUMBER.test(accountRef)
    ? "Use the registration and last 4 digits only, never a full account number."
    : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!household) {
      setHouseholdError("Choose the household this request is for.");
      return;
    }
    if (accountError) return;
    const number =
      Math.max(1000, ...serviceRequests.map((request) => request.number)) + 1;
    addServiceRequest(
      createRequest({
        template,
        number,
        householdId: household.id,
        accountRef: accountRef.trim() || null,
        amount:
          showAmount && amount ? Math.max(0, Math.round(Number(amount))) : null,
        owner,
        advisor: household.advisor,
      }),
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      <DialogHeader>
        <DialogTitle>New service request</DialogTitle>
        <DialogDescription>
          Pick a standardized workflow. The checklist, owners and SLA come from
          the template.
        </DialogDescription>
      </DialogHeader>

      <FormSection title="Request">
        <Field label="Request type" htmlFor="request-type">
          <Select value={templateKey} onValueChange={setTemplateKey}>
            <SelectTrigger id="request-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[min(420px,var(--radix-select-content-available-height))] overflow-y-auto">
              {REQUEST_CATEGORIES.map((category) => (
                <SelectGroup key={category}>
                  <SelectLabel>{category}</SelectLabel>
                  {REQUEST_TEMPLATES.filter(
                    (item) => item.category === category,
                  ).map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Household"
          htmlFor="request-household"
          required
          error={householdError ?? undefined}
        >
          <Select
            value={householdId}
            onValueChange={(value) => {
              setHouseholdId(value);
              setHouseholdError(null);
            }}
          >
            <SelectTrigger
              id="request-household"
              aria-invalid={householdError ? true : undefined}
            >
              <SelectValue placeholder="Choose a household" />
            </SelectTrigger>
            <SelectContent>
              {eligible.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                  {item.type === "Prospect" ? " (prospect)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Account"
            htmlFor="request-account"
            hint="Registration and last 4 only."
            error={accountError ?? undefined}
          >
            <Input
              id="request-account"
              value={accountRef}
              onChange={(event) => setAccountRef(event.target.value)}
              placeholder="Rollover IRA •••• 4410"
              autoComplete="off"
              aria-invalid={accountError ? true : undefined}
              className="aria-invalid:border-danger"
            />
          </Field>
          {showAmount ? (
            <Field label="Amount" htmlFor="request-amount">
              <div className="relative">
                <span
                  aria-hidden
                  className="text-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] leading-none"
                >
                  $
                </span>
                <Input
                  id="request-amount"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="25000"
                  className="pl-6 tabular-nums"
                />
              </div>
            </Field>
          ) : (
            <div aria-hidden className="hidden sm:block" />
          )}
        </div>

        <Field label="Owner" htmlFor="request-owner">
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger id="request-owner">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPERATIONS_TEAM.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      <FormSection title="Workflow preview">
        <p className="caption-style text-soft">
          {template.steps.length} steps · {template.slaBD} business-day SLA ·
          due {formatDate(addBusinessDays(TODAY, template.slaBD))} ·{" "}
          {template.priority} priority
        </p>
        <ol className="flex flex-col gap-1.5">
          {template.steps.map((step, index) => (
            <li
              key={step.name}
              className="caption-style flex items-start gap-2"
            >
              <span className="text-subtle w-[2ch] shrink-0 text-right tabular-nums">
                {index + 1}.
              </span>
              <span className="text-soft min-w-0 flex-1">{step.name}</span>
              <RoleTag role={step.role} />
            </li>
          ))}
        </ol>
        <p className="caption-style text-subtle">
          Watch for: {template.nigoRisks}
        </p>
      </FormSection>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="subtle" size="sm">
            Cancel
          </Button>
        </DialogClose>
        <Button variant="primary" size="sm" type="submit">
          <PlusIcon aria-hidden className="size-3" />
          Create request
        </Button>
      </DialogFooter>
    </form>
  );
}
