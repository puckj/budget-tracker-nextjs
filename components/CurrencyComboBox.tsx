"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOptionDisplay, setSelectedOptionDisplay] =
    React.useState<Currency | null>(null);

  const userSettings = useQuery<UserSettings>({
    // useQuery เป็น Hook จาก React Query ที่ช่วยในการดึงข้อมูล (fetch data) จาก API
    // useQuery จะทำการ Refetch ข้อมูลอยู่เสมอ
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
    staleTime: 1000 * 60 * 5, // ตั้งเวลาว่าข้อมูลนี้จะไม่ล้าสมัยเป็นเวลา 5 นาที
    refetchOnWindowFocus: false, // ปิดการดึงข้อมูลใหม่เมื่อหน้าต่างกลับมาโฟกัส
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (c) => c.value === userSettings.data.currency,
    );
    if (userCurrency) setSelectedOptionDisplay(userCurrency);
  }, [userSettings.data]);

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency, //กำหนดให้ UpdateUserCurrency เป็นฟังชั่นทำงานสำหรับ mutation นี้
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency updated successfully 🎉`, {
        id: "update-currency",
      });
      setSelectedOptionDisplay(
        Currencies.find((c) => c.value === data.currency) || null,
      );
    },
    onError: (e) => {
      console.error(e);
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Update currency...", {
        id: "update-currency",
      });
      mutation.mutate(currency.value); // ส่ง currency.value ไปให้กับ mutation
    },
    [mutation],
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending || userSettings.isFetching}
            >
              {selectedOptionDisplay ? (
                <>{selectedOptionDisplay.label}</>
              ) : (
                <>+ Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending || userSettings.isFetching}
          >
            {selectedOptionDisplay ? (
              <>{selectedOptionDisplay.label}</>
            ) : (
              <>+ Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (currency: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null,
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
