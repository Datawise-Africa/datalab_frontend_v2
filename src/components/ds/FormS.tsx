import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Users,
  Award,
  Search,
  CheckCircle,
} from 'lucide-react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const _steps = [
  {
    id: 1,
    title: 'Basic info',
    icon: CheckCircle,
    header: {
      title: 'Basic Information',
      description: 'Provide essential information about your dataset.',
    },
  },
  {
    id: 2,
    title: 'Files',
    icon: Upload,
    header: {
      title: 'Upload Files',
      description: 'Upload the files, metadata, and datasheets.',
    },
  },
  {
    id: 3,
    title: 'Attribution',
    icon: Users,
    header: {
      title: 'Attribution & Citation',
      description:
        'Add authors and choose an appropriate license for your dataset.',
    },
  },
  {
    id: 4,
    title: 'Discovery',
    icon: Search,
    header: {
      title: 'Discovery Information',
      description: 'Make your dataset discoverable with key words and regions.',
    },
  },
  {
    id: 5,
    title: 'Terms',
    icon: Award,
    header: {
      title: 'Review & Finalize',
      description: 'Review your information and agree to platform terms.',
    },
  },
];

export default function FormS() {
  const [step, setStep] = useState(5);
  const form = useForm();
  const currentStep = _steps.find((s) => s.id === step);

  const nextStep = () => {
    if (step < _steps.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Dialog>
      <Form {...form}>
        <div className="w-full">
          <DialogTrigger asChild>
            <Button className="transform rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl">
              Create Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-h-[95vh] min-h-[85vh] w-[95vw] !max-w-[60rem] flex-col overflow-hidden rounded-3xl border-0 bg-white/90 p-4 shadow-2xl backdrop-blur-lg">
            {/* Progress Bar */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r transition-all duration-500 ease-out"
                style={{
                  width: `${(step / _steps.length) * 100}%`,
                }}
              />
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <div className="flex items-center space-x-4">
                {_steps.map((s, index) => {
                  const Icon = s.icon;
                  const isActive = s.id === step;
                  const isCompleted = s.id < step;

                  return (
                    <div key={s.id} className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                          isActive
                            ? 'scale-110 bg-gradient-to-r shadow-lg'
                            : isCompleted
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                        } `}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < _steps.length - 1 && (
                        <div
                          className={`mx-2 h-0.5 w-12 transition-all duration-300 ${s.id < step ? 'bg-green-500' : 'bg-gray-200'} `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogHeader className="px-8 pb-2 text-center">
              <DialogTitle className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent">
                {currentStep?.header.title}
              </DialogTitle>
              <DialogDescription className="text-lg leading-relaxed text-gray-600">
                {currentStep?.header.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-4xl">
                {step === 1 && <Step1 form={form} />}
                {step === 2 && <Step2 form={form} />}
                {step === 3 && <Step3 form={form} />}
                {step === 4 && <Step4 form={form} />}
                {step === 5 && <Step5 form={form} />}
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between border-t border-gray-100 bg-white/50 px-12 py-8 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl border-gray-200 px-6 py-2 transition-all duration-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                {step > 1 && (
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="rounded-xl border-gray-200 px-6 py-2 transition-all duration-200 hover:bg-gray-50"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">
                  Step {step} of {_steps.length}
                </span>
                {step < _steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="transform rounded-xl px-6 py-2 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="transform rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-2 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </div>
      </Form>
    </Dialog>
  );
}
