import { NashemannLoader } from "@/components/nashemann-loader";
import { SimpleLoader } from "@/components/simple-loader";
import { getCurrentVendor } from "@/lib/tenant";

export default async function Loading() {
  const vendor = await getCurrentVendor();
  return vendor.slug === "nigehbaan" ? <SimpleLoader /> : <NashemannLoader />;
}
