import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";

import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Image from "next/image";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { GetStaticProps, GetStaticPaths } from "next";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  menuButton: {},
  container: {
    padding: 20,
  },
});

type Props = {
  offers?: any;
  errors?: string;
};

const Home = ({ offers, errors }: Props) => {
  const [state, setState] = useState({ value: "" });

  const classes = useStyles();

  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  if (errors) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={12}>
        <TextField
          onChange={(e) => setState(e.target.value)}
          value={state.value}
          fullWidth
        />
      </Grid>
      {offers.map((item: any) => (
        <Grid item xs={12} sm={6} lg={3} key={item.id}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Grid item xs={12}>
                <Image
                  src={`${item?.store?.logoUri}` || "/images/noimage.png"}
                  width={500}
                  height={140}
                />
              </Grid>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {item.id}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

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

export default Home;
