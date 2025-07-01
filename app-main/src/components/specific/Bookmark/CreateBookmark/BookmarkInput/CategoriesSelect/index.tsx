import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryCategoriesDomain } from "@/hooks/useCategory";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setCategoryId: Dispatch<SetStateAction<string | undefined>>;
  categoryId?: string;
}

const CategoriesSelect = ({ setCategoryId, categoryId }: Props) => {
  const { data } = useQueryCategoriesDomain();

  return (
    <Select
      onValueChange={(value) => setCategoryId(value)}
      defaultValue={categoryId}
    >
      <SelectTrigger className="bg-slate-100">
        <SelectValue placeholder="Choisir une catégorie" />
      </SelectTrigger>
      <SelectContent>
        {data &&
          data.map((category) => (
            <SelectItem value={category.id} key={category.id}>
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default CategoriesSelect;
