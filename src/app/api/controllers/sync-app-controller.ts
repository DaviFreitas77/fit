
import { syncApp } from "../services/syncronize-app-service";

export async function POST(request: Request) {
  return syncApp(request);
}
