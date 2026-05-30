/**
 * Loads AiReWrite/personalities.json and resolves display fields for posts.
 */
const LocialPersonalities = {
  list: [],
  byId: {},

  async load(path = "../AiReWrite/personalities.json") {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load personalities: ${res.status}`);
    const data = await res.json();
    this.list = data.personalities;
    this.byId = Object.fromEntries(this.list.map((p) => [p.id, p]));
    return this;
  },

  get(id) {
    return this.byId[id] ?? null;
  },

  shortFromName(name) {
    return name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  },

  /** Display fields for a post (name, color, short from personalities.json). */
  resolve(post) {
    const p = this.get(post.personality.id);
    const name = p?.name ?? post.personality.name;
    return {
      id: post.personality.id,
      name,
      color: p?.color ?? "#8696a0",
      short: p?.short ?? this.shortFromName(name),
    };
  },
};
