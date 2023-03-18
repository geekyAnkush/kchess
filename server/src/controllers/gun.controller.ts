import type { Request, Response } from "express";
import Gun from "gun";
// Import Gun.js library

// Initialize Gun.js instance
const gun = Gun();

// Retrieve a node in the graph database
const node = gun.get("myNode");

// Store a single key-value pair
// node.put({ key: "value" });

export const storeValues = async (req: Request, res: Response) => {
    // node.put({ test: "ankush" });
    const { key, value } = req.body;
    const node = gun.get(key);
    node.put({ [key]: value });
    res.send(`Stored ${key}: ${value}`);
};
export const showValues = async (req: Request, res: Response) => {
    // node.val();
};
