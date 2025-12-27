import { User } from "@/types";

/**
 * This array simulates a database consisting of a list of users.
 * After signing up with your auth solution (e.g. GitHub, Auth0)
 * place your user info in an object, with the email address you used
 * as the id.
 * The groupIds are the names of the groups the user is part of.
 * Group info is in /data/groups.ts
 */
export const users: Omit<User, "color">[] = [
  /*
  {
    id: "[YOUR EMAIL ADDRESS]",
    name: "[YOUR DISPLAY NAME]",
    avatar: "https://liveblocks.io/avatars/avatar-0.png",
    groupIds: ["product", "engineering", "design"],
  },
  */
  {
    id: "enjoyweaver@gmail.com",
    name: "Michael Weaver",
    avatar: "/images/board/weaver.jpg",
    groupIds: [
      "board_member",
      "audit_committee",
      "michaels_notes",
      "historical_agendas",
      "tokenomics",
    ],
  },
  {
    id: "zack@xogosgaming.com",
    name: "Zack Edwards",
    avatar: "/images/board/zack.png",
    groupIds: [
      "board_member",
      "zacks_notes",
      "historical_agendas",
      "tokenomics",
    ],
  },
  {
    id: "braden@kennyhertzperry.com",
    name: "Braden Perry",
    avatar: "/images/board/braden.jpg",
    groupIds: ["board_member", "bradens_notes", "historical_agendas"],
  },
  {
    id: "terrence@terrencegatsby.com",
    name: "Terrance Gatsby",
    avatar: "/images/board/terrance.jpg",
    groupIds: [
      "board_member",
      "compliance_&_regulations_committee",
      "terrences_notes",
      "historical_agendas",
    ],
  },
  {
    id: "sturs49@gmail.com",
    name: "Kevin Stursberg",
    avatar: "/images/board/kevin.jpg",
    groupIds: ["board_member", "kevins_notes", "historical_agendas"],
  },
  {
    id: "mckaylaareece@gmail.com",
    name: "McKayla",
    avatar: "/images/board/mckayla.jpg",
    groupIds: [
      "board_member",
      "education_committee",
      "mckaylas_notes",
      "historical_agendas",
    ],
  },
  {
    id: "tbd",
    name: "tbd",
    avatar: "https://liveblocks.io/avatars/avatar-6.png",
    groupIds: ["advisory_board"],
  },
  {
    id: "",
    name: "tbd",
    avatar: "https://liveblocks.io/avatars/avatar-6.png",
    groupIds: ["advisory_board"],
  },
];
