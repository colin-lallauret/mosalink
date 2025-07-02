"use client";

import { useCallback } from "react";
import { useMutationCreateCategory } from "@/hooks/category/useMutationCreateCategory";
import { useMutationDeleteCategory } from "@/hooks/category/useMutationDeleteCategory";
import { useMutationModifyCategory } from "@/hooks/category/useMutationModifyCategory";
import { useQueryCategoriesAdmin } from "@/hooks/category/useQueryCategoriesAdmin";
import { getNameToUrl } from "@/utils/url/utils";
import CategorySelect2 from "@/components/ui/category-select2";

const CategoryManageV2 = () => {
  const { data: categories = [], isLoading, isError } = useQueryCategoriesAdmin();
  const createCategoryMutation = useMutationCreateCategory();
  const modifyCategoryMutation = useMutationModifyCategory();
  const deleteCategoryMutation = useMutationDeleteCategory();

  const handleCreateCategory = useCallback(
    (name: string) => {
      createCategoryMutation.mutate({
        name,
        url: getNameToUrl(name),
      });
    },
    [createCategoryMutation]
  );

  const handleUpdateCategory = useCallback(
    (id: string, name: string) => {
      modifyCategoryMutation.mutate({
        id,
        name,
        url: getNameToUrl(name),
      });
    },
    [modifyCategoryMutation]
  );

  const handleDeleteCategory = useCallback(
    (id: string) => {
      deleteCategoryMutation.mutate(id);
    },
    [deleteCategoryMutation]
  );

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Erreur lors du chargement des catégories
      </div>
    );
  }

  return (
    <CategorySelect2
      categories={categories}
      onCreateCategory={handleCreateCategory}
      onUpdateCategory={handleUpdateCategory}
      onDeleteCategory={handleDeleteCategory}
      isLoading={isLoading}
      className="max-w-2xl mx-auto"
    />
  );
};

export default CategoryManageV2;
