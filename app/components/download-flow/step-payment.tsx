interface StepPaymentProps {
  price: number;
  datasetName: string;
}

export function StepPayment({ price, datasetName }: StepPaymentProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 text-center">
        <p className="text-sm text-muted-foreground">Dataset</p>
        <p className="font-medium">{datasetName}</p>
        <p className="mt-2 text-3xl font-bold text-primary">${price}</p>
        <p className="text-xs text-muted-foreground">One-time payment</p>
      </div>

      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Payment integration will be configured here.
        <br />
        Supported methods: M-Pesa, Card, Bank Transfer.
      </div>
    </div>
  );
}
