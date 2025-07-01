import CategoryBoard from "@/components/specific/Board/CategoryBoard";

interface Props {
  params: {
    categorie: string;
  };
}

export default async function Categorie({ params }: Props) {
  return <CategoryBoard id={params.categorie} />;
}
