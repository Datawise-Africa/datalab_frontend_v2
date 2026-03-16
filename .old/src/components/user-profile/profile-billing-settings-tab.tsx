import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, HardDrive } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProfileBillingSettingsTab() {
  return (
    <div className="grid gap-6">
      <Card className="my-8 border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-credit-card h-5 w-5"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            Billing & Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Current Plan</p>
              <p className="text-sm text-gray-500">Pro Plan - $29/month</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Active
              </span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-green-600">
                    Manage Subscription
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full bg-white p-4 sm:max-w-md"
                >
                  <SheetHeader>
                    <SheetTitle>Manage Your Subscription</SheetTitle>
                    <SheetDescription>
                      Update your plan, payment method, or cancel your
                      subscription.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label>Select New Plan</Label>
                      <RadioGroup defaultValue="pro" className="grid gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="basic" id="basic-plan" />
                          <Label htmlFor="basic-plan" className="font-medium">
                            Basic Plan ($9/month)
                          </Label>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-sm text-gray-500">
                              View Benefits
                            </AccordionTrigger>
                            <AccordionContent className="pl-6 text-sm text-gray-600">
                              <ul className="list-inside list-disc space-y-1">
                                <li>5 Datasets</li>
                                <li>1 GB Storage</li>
                                <li>Standard Support</li>
                                <li>Basic Analytics</li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pro" id="pro-plan" />
                          <Label htmlFor="pro-plan" className="font-medium">
                            Pro Plan ($29/month)
                          </Label>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="text-sm text-gray-500">
                              View Benefits
                            </AccordionTrigger>
                            <AccordionContent className="pl-6 text-sm text-gray-600">
                              <ul className="list-inside list-disc space-y-1">
                                <li>10 Datasets</li>
                                <li>5 GB Storage</li>
                                <li>Priority Support</li>
                                <li>Advanced Analytics</li>
                                <li>Custom Reports</li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="enterprise"
                            id="enterprise-plan"
                          />
                          <Label
                            htmlFor="enterprise-plan"
                            className="font-medium"
                          >
                            Enterprise Plan (Custom)
                          </Label>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-3">
                            <AccordionTrigger className="text-sm text-gray-500">
                              View Benefits
                            </AccordionTrigger>
                            <AccordionContent className="pl-6 text-sm text-gray-600">
                              <ul className="list-inside list-disc space-y-1">
                                <li>Unlimited Datasets</li>
                                <li>Unlimited Storage</li>
                                <li>Dedicated Account Manager</li>
                                <li>Real-time Analytics</li>
                                <li>SLA Guaranteed Uptime</li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </RadioGroup>
                      <Button className="mt-4">Change Plan</Button>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Input
                        id="payment-method"
                        value="Visa **** 1234 (Expires 12/25)"
                        readOnly
                      />
                      <Button variant="outline" className="mt-2">
                        Update Payment Method
                      </Button>
                    </div>

                    <div className="grid gap-2">
                      <Label>Cancel Subscription</Label>
                      <p className="text-sm text-gray-500">
                        If you cancel, your plan will remain active until the
                        end of your current billing period.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="mt-2">
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will cancel
                              your subscription, and your plan will remain
                              active until the end of your current billing
                              period.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              Confirm Cancellation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Next billing date: January 15, 2024
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Datasets</span>
            </div>
            <div className="text-4xl font-bold">6/10</div>
            <p className="text-sm text-gray-500">datasets downloaded</p>
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute h-full rounded-full bg-black"
                style={{ width: '60%' }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Storage</span>
            </div>
            <div className="text-4xl font-bold">2.4/5</div>
            <p className="text-sm text-gray-500">GB used</p>
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute h-full rounded-full bg-black"
                style={{ width: '48%' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
