import SnackCard from "@/components/shared/SnackCard";
import { allSnacks } from "@/lib/placeholder-data";

export default function AllSnacksPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                All Snacks
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Browse through all our delicious snacks from various vendors.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {allSnacks.map((snack) => (
                <SnackCard key={snack.id} snack={snack} />
            ))}
        </div>
      </div>
    </div>
  );
}
