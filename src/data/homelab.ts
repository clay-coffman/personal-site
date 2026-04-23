import servicesData from "./homelab.json";

export interface Service {
  name: string;
  description: string;
  /** My instance URL — leave empty to render as a non-link card. */
  url?: string;
  /** Upstream project / homepage (shown as a small secondary link). */
  upstream?: string;
  category: string;
  tags?: string[];
}

export interface HomelabData {
  host: string;
  blurb: string;
  services: Service[];
}

export const homelab: HomelabData = {
  host: "cloud-hil-1",
  blurb:
    "A small always-on server I run for photos, books, files, and a handful of other services. Everything is in Docker behind a reverse proxy, deployed and updated from a git-managed config repo. It's also where the sync jobs for this site live.",
  services: servicesData as Service[],
};
