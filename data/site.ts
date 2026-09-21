export type Activity = {
  slug: string;
  name: string;
  category: "Thrill" | "Family" | "Kids" | "Nature" | "Climbing";
  description: string;
  image: string;
  requirement?: string;
  price?: string;
};

export type Package = {
  slug: string;
  name: string;
  audience: string;
  description: string;
  image: string;
};

export const business = {
  name: "Ban Jungle Adventure",
  address: "Panchmane, Tarakeshwar-3, Kathmandu, Nepal",
  phone: "+977 9851166328",
  phoneLink: "+9779851166328",
  email: "info@banjungleadventure.com.np",
  whatsapp: "https://wa.me/9779851166328",
  siteUrl: "https://banjungleadventure.com.np",
};

// Temporary editorial imagery. Replace with optimized, business-owned photography in the CMS.
export const images = {
  hero: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2200&q=85",
  zipline: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1600&q=82",
  swing: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=82",
  climbing: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1400&q=82",
  cycling: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=82",
  kids: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=82",
  stay: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=2000&q=85",
  dining: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1800&q=85",
  nature: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85",
  group: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=82",
};

export const activities: Activity[] = [
  { slug: "roller-coaster-zipline", name: "Roller Coaster Zipline", category: "Thrill", description: "A twisting aerial ride through the forest and the experience visitors come to talk about.", image: images.zipline },
  { slug: "zip-line-adventure", name: "Zip Line Adventure", category: "Thrill", description: "Leave the ground behind and experience the jungle from a completely different perspective.", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=82" },
  { slug: "giant-swing", name: "Giant Swing", category: "Thrill", description: "A bold forest swing for adventure seekers ready to embrace the drop.", image: images.swing },
  { slug: "obstacle-course", name: "Obstacle Course", category: "Family", description: "Move, balance and problem-solve across a sequence of outdoor challenges.", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1400&q=82" },
  { slug: "wall-climbing", name: "Wall Climbing", category: "Climbing", description: "Test your focus and movement on a guided climbing experience.", image: images.climbing },
  { slug: "cycling", name: "Cycling", category: "Nature", description: "Trade city streets for fresh air and an active ride in natural surroundings.", image: images.cycling },
  { slug: "childrens-obstacle", name: "Children's Obstacle", category: "Kids", description: "An age-appropriate outdoor challenge where younger adventurers can move and explore.", image: images.kids },
];

export const packages: Package[] = [
  { slug: "adventure-day", name: "Adventure Day", audience: "Adventure seekers", description: "Build a day around the activities that excite you most.", image: images.zipline },
  { slug: "family-adventure", name: "Family Adventure", audience: "Families", description: "A flexible nature day with activities and time to reconnect.", image: images.kids },
  { slug: "school-group", name: "School Group", audience: "Schools", description: "Outdoor group experiences designed around participation and teamwork.", image: images.group },
  { slug: "group-adventure", name: "Group Adventure", audience: "Friends and organisations", description: "Bring your people together for a shared day outside the ordinary.", image: images.climbing },
  { slug: "adventure-night-stay", name: "Adventure + Night Stay", audience: "Overnight guests", description: "Pair daytime adventure with a quieter evening in the forest.", image: images.stay },
];

export const faqs = [
  ["What activities are available?", "Available experiences include the Roller Coaster Zipline, Zip Line Adventure, Giant Swing, obstacle courses, wall climbing, cycling and children's activities. Contact the team to confirm availability for your visit."],
  ["What are the opening hours?", "Opening hours can vary. Please call or message Ban Jungle Adventure before travelling to confirm the current schedule."],
  ["Do I need prior experience?", "Requirements vary by activity. The team will provide instructions before participation; contact us if you have questions about a particular activity."],
  ["Is equipment provided?", "Please contact the team for current equipment and activity-specific information."],
  ["Are activities suitable for children?", "Children's activities are available. Suitability and participation requirements depend on the activity and should be confirmed with the team."],
  ["What should I wear?", "Wear comfortable outdoor clothing and closed, secure footwear. Ask the team about any activity-specific clothing requirements."],
  ["How do I book?", "Send an inquiry through this website, call +977 9851166328, or message the team on WhatsApp. An inquiry is not a confirmed booking until the team responds."],
  ["Is night stay available?", "Yes, Ban Jungle Adventure promotes safari tent and night stay experiences. Contact the team for current availability, inclusions and pricing."],
  ["Are vegetarian food options available?", "Please contact the restaurant team to confirm current vegetarian choices and dietary needs."],
  ["How do I reach Ban Jungle?", "Ban Jungle Adventure is in Panchmane, Tarakeshwar-3, Kathmandu, Nepal. Use the map on the contact page or call for directions."],
  ["Are activities affected by weather?", "Outdoor activities may be affected by weather or operating conditions. Confirm activity availability before travelling."],
] as const;

export const timeline = [
  { year: "Early 2000s", title: "Origins and vision", text: "The early idea for a nature-focused destination begins to take shape." },
  { year: "2005", title: "Land development and forest restoration", text: "Work on the land and its forest environment moves the vision forward." },
  { year: "2010", title: "Opening to visitors", text: "Ban Jungle begins welcoming visitors into its outdoor setting." },
  { year: "2013", title: "Adventure expands", text: "The destination adds more ways for guests to experience outdoor adventure." },
  { year: "Today", title: "Adventure, nature, dining and stay", text: "The experience brings together activities, food, groups and overnight escapes." },
];

export const visitorExperiences = {
  Families: ["Children's activities", "Dining", "Nature time", "Flexible adventure"],
  Kids: ["Children's obstacle", "Outdoor play", "Family time", "Guided participation"],
  "Adventure Seekers": ["Roller Coaster Zipline", "Giant Swing", "Zip Line Adventure", "Wall Climbing"],
  Schools: ["Group activities", "Outdoor learning", "Teamwork", "Supervised adventure"],
  Groups: ["Shared challenges", "Dining", "Nature escape", "Group inquiries"],
  Corporate: ["Team experiences", "Group dining", "Outdoor setting", "Custom inquiry"],
};
