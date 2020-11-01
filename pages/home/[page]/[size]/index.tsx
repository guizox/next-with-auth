import { GetStaticPaths, GetStaticProps } from "next";
import Home from "../index";

export default Home;

export const getStaticPaths: GetStaticPaths = async () => {
  const sizes = [12, 24, 36, 48, 60];
  const paths = sizes
    .map((size) =>
      [1, 2, 3, 4].map((item) => ({
        params: { page: item.toString(), size: size.toString() },
      }))
    )
    .reduce((acc, cur) => [...acc, ...cur], []);

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    console.log("aqui", params);
    const page = params?.page || 1;
    const size = params?.size || 24;

    const buildUrl = (page: string, size: string) =>
      `https://api.sbwebservices.net/offer-query/offers/?portalId=[2,15]&locale=pt_BR&timeZoneId=America/Sao_Paulo&searchType=opened&filter=store.id:46;auction.modalityId:[1,4,5]&pageNumber=${page}&pageSize=${size}&orderBy=price:desc;visits:desc`;

    const response = await fetch(buildUrl(page as string, size as string));

    console.log(response);

    const { offers } = await response.json();

    return { props: { offers }, revalidate: 60 };
  } catch (err) {
    console.log(err);
    return { props: { errors: err.message } };
  }
};
