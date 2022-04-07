import { response } from "../utils.ts";

const hello = () => response.json({ message: "Hello, world!" });

export default hello;
