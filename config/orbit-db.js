import IPFS from "ipfs";
import OrbitDB from "orbit-db";

export default async () => {
  try {
    const ipfs = await IPFS.create({
      repo: process.env.DATABASE_REPO,
      start: true,
      EXPERIMENTAL: {
        pubsub: true,
      },
      config: { Bootstrap: [], Addresses: { Swarm: [] } },
    });
    const orbitdb = await OrbitDB.createInstance(ipfs, {
      directory: process.env.DATABASE_DIR,
    });
    const postsDb = await orbitdb.feed("posts", { overwrite: true });
    await postsDb.load();
    return { postsDb };
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}