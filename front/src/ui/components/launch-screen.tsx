import { cn } from "@/app/lib/utils/styles";
import { Transition } from "@headlessui/react";
import { Loader2Icon } from "lucide-react";

type Props = {
  isLoading: boolean;
};

export function LaunchScreen(props: Props) {
  const { isLoading } = props;

  return (
    <Transition
      show={isLoading}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={cn(
          "fixed top-0 left-0 w-full h-full bg-violet-100 z-50",
          "grid place-items-center"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="text-violet-500 animate-spin size-7" />
        </div>
      </div>
    </Transition>
  );
}
