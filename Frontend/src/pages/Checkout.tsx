import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";
import StripeCheckout from "@/pages/StripeCheckout";
import PayPalCheckout from "@/pages/PayPalCheckout";

interface Student {
  id: string;
  full_name: string;
  university: string;
  major: string;
  goal: number;
  raised: number;
}

const Checkout = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(100);
  const [coverFees, setCoverFees] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const res = await api.get(`/students/${studentId}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to load student:", err);
      }
    }
    if (studentId) loadStudent();
  }, [studentId]);

  if (!student) {
    return <p className="p-6 text-center text-muted-foreground">Loading student...</p>;
  }

  const presetAmounts = [25, 50, 100, 250, 500];
  const processingFee = amount * 0.029 + 0.3;
  const totalAmount = coverFees ? amount + processingFee : amount;

  const handleSuccess = () => {
    toast({
      title: "Donation Successful!",
      description: `Thank you for donating $${amount.toFixed(2)} to ${student.full_name}.`,
    });
    navigate("/donor/wallet");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 ? "Choose Donation Amount" : "Select Payment Method"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset ? "default" : "outline"}
                          onClick={() => setAmount(preset)}
                        >
                          ${preset}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <Label htmlFor="cover-fees" className="cursor-pointer">
                        Cover processing fees
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add ${processingFee.toFixed(2)} so 100% goes to the student
                      </p>
                    </div>
                    <Switch
                      id="cover-fees"
                      checked={coverFees}
                      onCheckedChange={setCoverFees}
                    />
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block text-indigo-500 font-semibold">
                        Pay with Stripe
                      </Label>
                      <StripeCheckout amount={Math.round(totalAmount * 100)} />
                    </div>

                    <div>
                      <Label className="mb-2 block text-blue-500 font-semibold">
                        Pay with PayPal
                      </Label>
                      <PayPalCheckout amount={Math.round(totalAmount * 100)} />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-1">{student.full_name}</p>
                <p className="text-sm text-muted-foreground">{student.university}</p>
                <p className="text-sm text-muted-foreground">{student.major}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Donation amount</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                {coverFees && (
                  <div className="flex justify-between text-sm">
                    <span>Processing fee</span>
                    <span className="font-medium">${processingFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                <p>You'll receive a tax receipt via email after your donation is processed.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
