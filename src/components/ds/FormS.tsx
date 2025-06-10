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
import {
    Form,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

// const _steps = [
//     {
//         id: 1,
//         title: 'Basic info',
//         header: {
//             title: 'Basic Information',
//             description: 'Provide essential information about your dataset.',
//         },
//     },
//     {
//         id: 2,
//         title: 'Files',
//         header: {
//             title: 'Upload Files',
//             description: 'Upload the files, metadata, and datasheets.',
//         },
//     },
//     {
//         id: 3,
//         title: 'Attribution',
//         header: {
//             title: 'Attribution & Citation',
//             description:
//                 'Add authors and choose an appropriate license for your dataset.',
//         },
//     },
//     {
//         id: 4,
//         title: 'Discovery',
//         header: {
//             title: 'Discovery Information',
//             description:
//                 'Make your dataset discoverable with key words and regions.',
//         },
//     },
//     {
//         id: 5,
//         title: 'Terms',
//         header: {
//             title: 'Review & Finalize',
//             description:
//                 'Review your information and aggree to platform terms.',
//         },
//     },
// ];

export default function FormS() {
    const [step] = useState(3);
    const form = useForm();
    return (
        <Dialog>
            <Form {...form}>
                <form className='w-full'>
                    <DialogTrigger asChild>
                        <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent className="flex max-h-[80vh] min-h-[60vh] w-full max-w-6xl flex-col bg-red-50">
                        <DialogHeader className="flex-[2]">
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save
                                when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid h-[calc(100%-100px)] flex-[8] gap-4 overflow-y-auto p-4 w-full">
                            <div>
                                {step === 1 && (
                                    <Step1
                                        form={form}
                                    />
                                )}
                               { step === 2 && (
                                    <Step2
                                        form={form}
                                    />)}
                                    { step === 3 && (
                                    <Step3
                                        form={form}
                                    />)}
                            </div>
                        </div>
                        <DialogFooter className="flex flex-[2] items-center justify-between">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
}
