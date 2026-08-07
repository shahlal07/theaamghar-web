import { getAddressesForCurrentUser } from "@/lib/queries/orders";
import { AddressCard } from "@/components/account/address-card";
import { AddAddressCard } from "@/components/account/add-address-card";
import { EmptyState } from "@/components/account/empty-state";

export default async function AddressesPage() {
  const addresses = await getAddressesForCurrentUser();

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold mb-6">Saved Addresses</h1>

      {addresses.length === 0 ? (
        <div className="flex flex-col gap-6">
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            title="No saved addresses yet"
            message="Add a home, office, or gift address so checkout only takes a couple of taps."
          />
          <div className="max-w-sm mx-auto w-full">
            <AddAddressCard />
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} />
          ))}
          <AddAddressCard />
        </div>
      )}
    </div>
  );
}
