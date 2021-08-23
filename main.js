

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
main();
