export const CONTACT_SOURCES = [
  "Client referral",
  "COI referral",
  "Seminar",
  "Website",
  "Acquired book",
] as const;
export type ContactSource = (typeof CONTACT_SOURCES)[number];

export type Gender = "Female" | "Male";

export type EmailType = "Home" | "Work";

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type PersonContact = {
  contactId: string;
  gender?: Gender;
  emailType?: EmailType;
  secondaryEmail?: { type: EmailType; address: string };
  homePhone?: string;
  workPhone?: string;
};

export type HouseholdContact = {
  address: Address;
  timeZone: string;
  source: ContactSource;
  referredBy?: string;
  writingAdvisor: string;
  associateAdvisor?: string;
  csa: string;
  createdOn: string;
  addedBy: string;
  people: Record<string, PersonContact>;
};

export const CONTACTS: Record<string, HouseholdContact> = {
  hartwell: {
    address: {
      street: "48 Spinnaker Way",
      city: "Sausalito",
      state: "CA",
      zip: "94965",
    },
    timeZone: "America/Los_Angeles",
    source: "Seminar",
    writingAdvisor: "Dana Whitfield",
    associateAdvisor: "Priya Raman",
    csa: "Leah Moreno",
    createdOn: "2013-11-18",
    addedBy: "Leah Moreno",
    people: {
      "hartwell-thomas": {
        contactId: "2104118",
        gender: "Male",
        homePhone: "+1 (415) 555-0144",
      },
      "hartwell-eleanor": {
        contactId: "2104119",
        gender: "Female",
        homePhone: "+1 (415) 555-0144",
      },
    },
  },
  reyes: {
    address: {
      street: "1406 Barton Crest Dr",
      city: "Austin",
      state: "TX",
      zip: "78704",
    },
    timeZone: "America/Chicago",
    source: "COI referral",
    referredBy: "Elena Ruiz, CPA",
    writingAdvisor: "Marcus Bell",
    associateAdvisor: "Owen Calloway",
    csa: "Theo Grant",
    createdOn: "2018-07-02",
    addedBy: "Theo Grant",
    people: {
      "reyes-daniel": {
        contactId: "2381540",
        gender: "Male",
        emailType: "Work",
        secondaryEmail: { type: "Home", address: "daniel.reyes@example.com" },
        workPhone: "+1 (512) 555-0120",
      },
      "reyes-sofia": { contactId: "2381541", gender: "Female" },
      "reyes-mateo": { contactId: "2381542", gender: "Male" },
      "reyes-lucia": { contactId: "2381543", gender: "Female" },
    },
  },
  chen: {
    address: {
      street: "722 Laurel Glen Ct",
      city: "Palo Alto",
      state: "CA",
      zip: "94301",
    },
    timeZone: "America/Los_Angeles",
    source: "Seminar",
    writingAdvisor: "Dana Whitfield",
    associateAdvisor: "Sam Ito",
    csa: "Leah Moreno",
    createdOn: "2011-04-12",
    addedBy: "Morgan Hale",
    people: {
      "chen-margaret": {
        contactId: "1987305",
        gender: "Female",
        homePhone: "+1 (650) 555-0132",
      },
      "chen-robert": { contactId: "1987306", gender: "Male" },
    },
  },
  feldman: {
    address: {
      street: "3318 Cedar Bluff Ln",
      city: "Denver",
      state: "CO",
      zip: "80206",
    },
    timeZone: "America/Denver",
    source: "COI referral",
    referredBy: "Dev Patel, CPA",
    writingAdvisor: "Morgan Hale",
    associateAdvisor: "Priya Raman",
    csa: "Theo Grant",
    createdOn: "2018-12-04",
    addedBy: "Theo Grant",
    people: {
      "feldman-aaron": {
        contactId: "2417762",
        gender: "Male",
        secondaryEmail: {
          type: "Work",
          address: "aaron.feldman@work.example.com",
        },
        workPhone: "+1 (303) 555-0178",
      },
      "feldman-naomi": { contactId: "2417763", gender: "Female" },
    },
  },
  patel: {
    address: {
      street: "6024 Ravenna Pl NE",
      city: "Seattle",
      state: "WA",
      zip: "98115",
    },
    timeZone: "America/Los_Angeles",
    source: "Client referral",
    referredBy: "Ethan Sullivan",
    writingAdvisor: "Owen Calloway",
    csa: "Leah Moreno",
    createdOn: "2022-03-28",
    addedBy: "Leah Moreno",
    people: {
      "patel-kevin": {
        contactId: "2698014",
        gender: "Male",
        secondaryEmail: {
          type: "Work",
          address: "kevin.patel@work.example.com",
        },
      },
      "patel-jasmine": { contactId: "2698015", gender: "Female" },
      "patel-arjun": { contactId: "2698016", gender: "Male" },
    },
  },
  whitaker: {
    address: {
      street: "2905 Linden Hollow Dr",
      city: "Raleigh",
      state: "NC",
      zip: "27608",
    },
    timeZone: "America/New_York",
    source: "Seminar",
    writingAdvisor: "Marcus Bell",
    associateAdvisor: "Sam Ito",
    csa: "Theo Grant",
    createdOn: "2015-10-20",
    addedBy: "Morgan Hale",
    people: {
      "whitaker-gregory": {
        contactId: "2213377",
        gender: "Male",
        homePhone: "+1 (919) 555-0126",
      },
      "whitaker-anne": {
        contactId: "2213378",
        gender: "Female",
        homePhone: "+1 (919) 555-0126",
      },
    },
  },
  brooks: {
    address: {
      street: "2450 N Kenmore Terrace, Unit 4B",
      city: "Chicago",
      state: "IL",
      zip: "60614",
    },
    timeZone: "America/Chicago",
    source: "Website",
    writingAdvisor: "Ruth Okafor",
    associateAdvisor: "Owen Calloway",
    csa: "Leah Moreno",
    createdOn: "2020-09-14",
    addedBy: "Leah Moreno",
    people: {
      "brooks-lauren": {
        contactId: "2560931",
        gender: "Female",
        emailType: "Work",
        secondaryEmail: { type: "Home", address: "lauren.brooks@example.com" },
        workPhone: "+1 (312) 555-0188",
      },
    },
  },
  morales: {
    address: {
      street: "4721 E Camelback Vista",
      city: "Phoenix",
      state: "AZ",
      zip: "85018",
    },
    timeZone: "America/Phoenix",
    source: "Seminar",
    writingAdvisor: "Priya Raman",
    csa: "Theo Grant",
    createdOn: "2021-06-30",
    addedBy: "Theo Grant",
    people: {
      "morales-victor": {
        contactId: "2634402",
        gender: "Male",
        workPhone: "+1 (602) 555-0150",
      },
      "morales-helen": { contactId: "2634403", gender: "Female" },
      "morales-isabel": { contactId: "2634404", gender: "Female" },
    },
  },
  sullivan: {
    address: {
      street: "77 Marlborough Row, Apt 3",
      city: "Boston",
      state: "MA",
      zip: "02116",
    },
    timeZone: "America/New_York",
    source: "Website",
    writingAdvisor: "Owen Calloway",
    csa: "Leah Moreno",
    createdOn: "2023-01-17",
    addedBy: "Leah Moreno",
    people: {
      "sullivan-ethan": {
        contactId: "2745120",
        gender: "Male",
        secondaryEmail: {
          type: "Work",
          address: "ethan.sullivan@work.example.com",
        },
      },
      "sullivan-chloe": { contactId: "2745121", gender: "Female" },
      "sullivan-nora": { contactId: "2745122", gender: "Female" },
    },
  },
  avery: {
    address: {
      street: "2847 NW Thurman Ridge",
      city: "Portland",
      state: "OR",
      zip: "97210",
    },
    timeZone: "America/Los_Angeles",
    source: "Acquired book",
    writingAdvisor: "Morgan Hale",
    associateAdvisor: "Sam Ito",
    csa: "Theo Grant",
    createdOn: "2012-02-06",
    addedBy: "Morgan Hale",
    people: {
      "avery-rosalind": {
        contactId: "2036587",
        gender: "Female",
        homePhone: "+1 (503) 555-0139",
      },
    },
  },
  coleman: {
    address: {
      street: "1188 Briarcliff Commons NE",
      city: "Atlanta",
      state: "GA",
      zip: "30306",
    },
    timeZone: "America/New_York",
    source: "Client referral",
    referredBy: "Kevin Patel",
    writingAdvisor: "Sam Ito",
    csa: "Leah Moreno",
    createdOn: "2023-12-05",
    addedBy: "Leah Moreno",
    people: {
      "coleman-brian": {
        contactId: "2819046",
        gender: "Male",
        workPhone: "+1 (404) 555-0194",
      },
      "coleman-tasha": { contactId: "2819047", gender: "Female" },
    },
  },
  thornton: {
    address: {
      street: "15 Cascade Knoll",
      city: "Mill Valley",
      state: "CA",
      zip: "94941",
    },
    timeZone: "America/Los_Angeles",
    source: "Client referral",
    referredBy: "Thomas and Eleanor Hartwell",
    writingAdvisor: "Dana Whitfield",
    csa: "Leah Moreno",
    createdOn: "2026-08-11",
    addedBy: "Dana Whitfield",
    people: {
      "thornton-william": { contactId: "3051208", gender: "Male" },
      "thornton-grace": { contactId: "3051209", gender: "Female" },
    },
  },
  shah: {
    address: {
      street: "301 Glenridge Terrace",
      city: "Los Gatos",
      state: "CA",
      zip: "95032",
    },
    timeZone: "America/Los_Angeles",
    source: "Website",
    writingAdvisor: "Marcus Bell",
    csa: "Theo Grant",
    createdOn: "2026-09-02",
    addedBy: "Theo Grant",
    people: {
      "shah-anika": {
        contactId: "3058873",
        gender: "Female",
        emailType: "Work",
        secondaryEmail: { type: "Home", address: "anika.shah@example.com" },
        workPhone: "+1 (408) 555-0129",
      },
    },
  },
  liu: {
    address: {
      street: "1520 E Alder Crest",
      city: "Seattle",
      state: "WA",
      zip: "98122",
    },
    timeZone: "America/Los_Angeles",
    source: "Seminar",
    writingAdvisor: "Owen Calloway",
    csa: "Leah Moreno",
    createdOn: "2026-07-22",
    addedBy: "Owen Calloway",
    people: {
      "liu-jordan": { contactId: "3042651" },
      "liu-casey": { contactId: "3042652" },
    },
  },
  donnelly: {
    address: {
      street: "41 Fairhaven Rd",
      city: "Brookline",
      state: "MA",
      zip: "02446",
    },
    timeZone: "America/New_York",
    source: "COI referral",
    referredBy: "Ruth Alvarez, Alvarez & Kim",
    writingAdvisor: "Ruth Okafor",
    csa: "Theo Grant",
    createdOn: "2026-09-15",
    addedBy: "Ruth Okafor",
    people: {
      "donnelly-patricia": {
        contactId: "3061490",
        gender: "Female",
        homePhone: "+1 (617) 555-0116",
      },
    },
  },
  bishop: {
    address: {
      street: "208 Weston Glen Way",
      city: "Cary",
      state: "NC",
      zip: "27519",
    },
    timeZone: "America/New_York",
    source: "Client referral",
    referredBy: "Gregory and Anne Whitaker",
    writingAdvisor: "Priya Raman",
    csa: "Theo Grant",
    createdOn: "2026-08-27",
    addedBy: "Priya Raman",
    people: {
      "bishop-samuel": { contactId: "3055316", gender: "Male" },
      "bishop-irene": { contactId: "3055317", gender: "Female" },
    },
  },
  lambert: {
    address: {
      street: "9640 E Desert Willow Dr",
      city: "Scottsdale",
      state: "AZ",
      zip: "85255",
    },
    timeZone: "America/Phoenix",
    source: "Seminar",
    writingAdvisor: "Sam Ito",
    csa: "Leah Moreno",
    createdOn: "2016-02-22",
    addedBy: "Morgan Hale",
    people: {
      "lambert-howard": { contactId: "2251874", gender: "Male" },
      "lambert-june": { contactId: "2251875", gender: "Female" },
    },
  },
  foster: {
    address: {
      street: "1764 S Clarkson Ridge",
      city: "Denver",
      state: "CO",
      zip: "80210",
    },
    timeZone: "America/Denver",
    source: "Website",
    writingAdvisor: "Owen Calloway",
    csa: "Theo Grant",
    createdOn: "2019-06-18",
    addedBy: "Theo Grant",
    people: {
      "foster-diane": {
        contactId: "2499630",
        gender: "Female",
        secondaryEmail: {
          type: "Work",
          address: "diane.foster@work.example.com",
        },
      },
    },
  },
};
