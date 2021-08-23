

import IPFS from "ipfs";
import OrbitDB from "orbit-db";
import { v4 as uuidv4 } from "uuid";

const creatures = ["🐙", "🐷", "🐬", "🐞", "🐈", "🙉", "🐸", "🐓"];

console.log("Starting...");

async function main() {
  let posts;

  try {
    const ipfs = await IPFS.create({
      repo: "./db",
      start: true,
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: { Bootstrap: [], Addresses: { Swarm: [] }}
    });
    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: "./db/harkl",
    });
    posts = await orbitdb.feed("posts", { overwrite: true });
    await posts.load();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const query = async () => {
    const index = Math.floor(Math.random() * creatures.length);

    try {
      await posts.add({ avatar: creatures[index], userId: uuidv4() });
      const latest = posts.iterator({ limit: 5 }).collect();
      let output = ``;
      output += `[Latest Visitors]\n`;
      output += `--------------------\n`;
      output += `ID  | Visitor\n`;
      output += `--------------------\n`;
      output +=
        latest
          .reverse()
          .map((e) => e.payload.value.userId + " | " + e.payload.value.avatar)
          .join("\n") + `\n`;
      console.log(output);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  };

  setInterval(query, 1000);
}
export class Post {
  constructor(Ipfs, OrbitDB) {
    this.OrbitDB = OrbitDB;
    this.Ipfs = Ipfs;
  }

  async create() {
    this.node = await this.Ipfs.create({
      preload: { enabled: false },
      repo: "./ipfs",
      EXPERIMENTAL: { pubsub: true },
      config: {
        Bootstrap: [],
        Addresses: { Swarm: [] },
      },
    });

    this._init();
  }

  async _init() {
    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: "./db/harkl",
    });

    this.defaultOptions = {
      accessController: {
        write: [this.orbitdb.identity.id],
      },
    };

    const docStoreOptions = {
      ...this.defaultOptions,
      indexBy: "hash",
    };
    this.pieces = await this.orbitdb.docstore("pieces", docStoreOptions);
    await this.pieces.load();
    this.onready();
  }

  async addPost(hash, title = "a tweet goes here") {
    const existingPost = this.getPostByHash(hash);
    if (!existingPost) {
      const cid = await this.pieces.put({ hash, title });
      return cid;
    } else {
      return await this.updatePostByHash(hash, title);
    }
  }

  async updatePostByHash(hash, title = "a tweet goes here") {
    const piece = await this.getPostByHash(hash);
    piece.title = title;
    return await this.pieces.put(piece);
  }

  async deletePostByHash(hash) {
    return await this.pieces.del(hash);
  }

  getAllPosts() {
    const pieces = this.pieces.get("");
    return pieces;
  }

  getPostByHash(hash) {
    const singlePost = this.pieces.get(hash)[0];
    return singlePost;
  }
}
