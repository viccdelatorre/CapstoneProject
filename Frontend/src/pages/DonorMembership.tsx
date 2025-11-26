import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Medal } from "lucide-react";

const DonorMembership = () => {
  const tiers = [
    {
      name: "Bronze",
      min: 0,
      desc: "Entry level — join the donor community.",
      color: "text-amber-700",
      medalColor: "text-amber-500",
    },
    {
      name: "Silver",
      min: 500,
      desc: "Increased benefits and recognition.",
      color: "text-gray-600",
      medalColor: "text-gray-400",
    },
    {
      name: "Gold",
      min: 2000,
      desc: "Top-tier support with exclusive perks.",
      color: "text-yellow-600",
      medalColor: "text-yellow-400",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6">Membership Tiers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className="text-center p-6">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Medal className={`h-12 w-12 mb-2 ${tier.medalColor}`} />
                <CardTitle className={`text-2xl font-bold ${tier.color}`}>
                  {tier.name} Tier
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{tier.desc}</p>
              <p className="font-semibold">Minimum Donation: ${tier.min}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DonorMembership;
