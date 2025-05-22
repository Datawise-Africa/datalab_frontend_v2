import { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function BecomeDatasetCreatorBadge() {
  const [show, setShow] = useState(true);
  return show ? (
    <div className="w-full relative py-6 px-2 text-sm bg-primary/10">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className="absolute top-0 right-0 z-10"
        size="sm"
        asChild
      >
        <div>
          <X className="h-4 w-4 text-primary" />
        </div>
      </Button>
      <div className="flex flex-col gap-2 text-center ">
        <h2 className="font-bold">Become a Dataset Creator</h2>
        <p className="text-primary">
          Share your data with the world, track engagement, and earn from
          premium datasets. Apply now to get started!
        </p>
      </div>
      <Button onClick={() => setShow(true)} className="text-subtle">
        Become a Dataset Creator
      </Button>
    </div>
  ) : (
    <></>
  );
}
