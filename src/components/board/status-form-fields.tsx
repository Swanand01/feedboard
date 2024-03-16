import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Control, FieldArrayWithId, UseFormRegister } from "react-hook-form";
import ActionDialog from "../ui/action-dialog";
import { CategoryFormInputs, StatusFormField } from "@/lib/board/constants";

interface StatusFieldsProps {
    statuses: FieldArrayWithId<StatusFormField>[];
    control: Control<CategoryFormInputs>;
    register: UseFormRegister<CategoryFormInputs>;
    handleRemoveStatus: (indexToRemove: number) => void;
}

export default function StatusFormFields({
    statuses,
    control,
    register,
    handleRemoveStatus,
}: StatusFieldsProps) {
    return statuses.map((status, index) => {
        return (
            <FormField
                key={status.id}
                control={control}
                name={`statuses.${index}`}
                render={(field) => {
                    return (
                        <FormItem className="w-full">
                            <FormLabel>
                                Status {index + 1}
                                {status.isDefault && " - Default"}
                            </FormLabel>
                            <FormControl>
                                <div className="flex gap-4">
                                    <Input
                                        placeholder={`Status ${index + 1}`}
                                        {...register(
                                            `statuses.${index}.title` as const,
                                        )}
                                    />
                                    <Input
                                        type="color"
                                        {...register(
                                            `statuses.${index}.colour` as const,
                                        )}
                                        className="w-20 px-1"
                                    />
                                    {!status.isDefault &&
                                        (status.statusId === "" ? (
                                            <Button
                                                type="button"
                                                variant={"destructive"}
                                                onClick={() =>
                                                    handleRemoveStatus(index)
                                                }
                                            >
                                                <MinusCircledIcon
                                                    width={16}
                                                    height={16}
                                                />
                                            </Button>
                                        ) : (
                                            <ActionDialog
                                                trigger={
                                                    <Button
                                                        type="button"
                                                        variant={"destructive"}
                                                    >
                                                        <MinusCircledIcon
                                                            width={16}
                                                            height={16}
                                                        />
                                                    </Button>
                                                }
                                                title="Are you absolutely sure?"
                                                description={
                                                    "This will remove the status and reassign all its posts to the default Status."
                                                }
                                                onClickContinue={() =>
                                                    handleRemoveStatus(index)
                                                }
                                            />
                                        ))}
                                </div>
                            </FormControl>
                            <FormMessage>
                                {field.formState.errors.statuses
                                    ? field.formState.errors.statuses[index]
                                          ?.title?.message
                                    : ""}
                            </FormMessage>
                        </FormItem>
                    );
                }}
            />
        );
    });
}
