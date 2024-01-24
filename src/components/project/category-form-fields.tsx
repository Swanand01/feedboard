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
import { CategoryFormField, ProjectFormInputs } from "@/lib/project/constants";

interface CategoryFieldsProps {
    categories: FieldArrayWithId<CategoryFormField>[];
    control: Control<ProjectFormInputs>;
    register: UseFormRegister<ProjectFormInputs>;
    handleRemoveCategory: (indexToRemove: number) => void;
}

export default function CategoryFormFields({
    categories,
    control,
    register,
    handleRemoveCategory,
}: CategoryFieldsProps) {
    return categories.map((category, index) => {
        return (
            <FormField
                key={category.id}
                control={control}
                name={`categories.${index}`}
                render={(field) => {
                    return (
                        <FormItem className="w-full">
                            <FormLabel>Category {index + 1}</FormLabel>
                            <FormControl>
                                <div className="flex gap-4">
                                    <Input
                                        placeholder={`Category ${index + 1}`}
                                        {...register(
                                            `categories.${index}.title` as const
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant={"destructive"}
                                        onClick={() =>
                                            handleRemoveCategory(index)
                                        }
                                    >
                                        <MinusCircledIcon
                                            width={16}
                                            height={16}
                                        />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage>
                                {field.formState.errors.categories
                                    ? field.formState.errors.categories[index]
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
