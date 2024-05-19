import * as fs from "fs";
import { FeaturedProjects } from "./Types";

/**
 * Freeze the JSON object to a file
 * @param json The JSON object to freeze
 * @param path The path to the file to freeze the JSON object to
 * @param context The context of the JSON object (will be logged to the console as 'Frozen ${context} to ${path}')
 */
export const freeze = (
  json: FeaturedProjects,
  path: string,
  context?: string
) => {
  const jsonString = JSON.stringify(json, null, 2); // Convert the JSON to a string with indentation
  try {
    fs.writeFileSync(path, jsonString); // Write the JSON string to the file
    if (context) console.log(`Frozen ${context} to ${path}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * A wrapper around the Response class that unfreezes the JSON object if it is not empty.
 */
export class FrozenResponse extends Response {
  /**
   * Creates a new instance of FrozenResponse.
   * @param json The JSON object to unfreeze.
   */
  constructor(json: FeaturedProjects) {
    if (json.length === 0) {
      console.warn("Frozen response was empty");
      super("[]" as any, {
        status: 404,
        statusText: "Not found",
      });
    } else {
      super(JSON.stringify(json));
    }
  }
}
