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
import ActionDialog from "../ui/action-dialog";

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
        const categoryData = category as unknown as CategoryFormField;
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
                                            `categories.${index}.title` as const,
                                        )}
                                    />
                                    {categoryData.categoryId === "" ? (
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
                                                "This will remove the category and all its posts."
                                            }
                                            onClickContinue={() =>
                                                handleRemoveCategory(index)
                                            }
                                        />
                                    )}
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
