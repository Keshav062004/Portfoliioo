export const social = [
  {
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=keshavgupta072004@gmail.com",
    name: "mail",
  },
  {
    url: "https://github.com/Keshav062004",
    name: "github",
  },
  {
    url: "https://www.linkedin.com/in/keshav07/",
    name: "linkedin",
  },
  {
    url: "tel:+91 9485991690",
    name: "x",
  },
] as const satisfies {
  url: string;
  name: "mail" | "github" | "linkedin" | "x";
}[];