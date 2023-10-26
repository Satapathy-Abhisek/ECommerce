import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { database } from '../../firebase'
import { Grid,useMediaQuery,useTheme,makeStyles,Typography,TextField } from '@material-ui/core';
import ItemCards from '../productComponents/ItemCards'
import { debounce } from 'lodash';

const useStyles = makeStyles(theme => ({
   rowContainer: {
       paddingLeft: '5em',
       paddingRight: '5em',
       paddingTop: '2em',
       paddingBottom: '10em',
       [theme.breakpoints.down('sm')]: {
           paddingLeft: '1em',
           paddingRight: '1em',
           paddingTop: '1em',
       },
       [theme.breakpoints.down('xs')]: {
           paddingLeft: '0.5em',
           paddingRight: '0.5em',
           paddingTop: '0.5em',
       }
   },
}))

// const Search = (props) => {
   
//    const theme = useTheme();
//        const classes = useStyles();
//        const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
//        const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
//        const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));
//       const [data, setData] = useState([]);
//       const useQuery = () => {
//          return new URLSearchParams(useLocation().search)
//       }
//       let query = useQuery();
//       let search = query.get("name");
//       console.log(search)
//    useEffect(() => {
//       window.scroll(0, 0);

//       const searchData = async () => {
//          try {
//             const collections = ['womens', 'mens', 'mobile'];
//             const fdata = [];

//             for (const collectionName of collections) {
//                const collectionRef = database.collection('collection').doc(collectionName);
//                const querySnapshot = await collectionRef.collection('lists').where("type", "==", search).get();

//                querySnapshot.forEach((item) => {
//                   fdata.push({ ...item.data(), key: item.id });
//                });
//             }
//             if (fdata.length !== 0) {
//                setData(fdata);
//             } else {
//                setData([]);
//             }
//          } catch (error) {
//             console.error("Error fetching data:", error);
//             setData([]);
//          }
//       };

//       searchData();
//    }, [search]);

//    return (
      
//        <Grid
//       container
//       direction='column'
//       alignItems='center'
//       justifyContent='center'
//       className={classes.rowContainer}
//       >
//       <Grid item>
//          <Typography  variant='h4' >Search Results</Typography>
//       </Grid>
//       <Grid
//           item
//           container
//           direction='row'
//           alignItems='center'
//           justifyContent='center'
//           className={classes.rowContainer}
//       >
//       {data && data.map((doc) =>
//               <Grid item style={{maxWidth:'40em',marginLeft:matchesXS?0:matchesSM?'1em':matchesMD?'2em':'8em'}} >
      
//                   <ItemCards
//                       key={doc.id}
//                       id={doc.id}
//                       productName={doc.productName}
//                       image={doc.image}
//                       price={doc.price}
//                       oldPrice={doc.oldPrice}
//                       user={props.user}
//                   />
//                   </Grid>
//             )}
//             {data.length !== 0 ? (<></>) : (<h2>Eh ! Keyword Error......</h2>)}
//       </Grid>
//       </Grid>
   
//   );
// }

// export default Search;

const Search = (props) => {
   const theme = useTheme();
   const classes = useStyles();
   const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
   const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
   const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));
   const [products, setProducts] = useState([]);
   const [search, setSearch] = useState('');
   const [searchResults, setSearchResults] = useState([]);

   useEffect(() => {
      window.scroll(0, 0);

      const fetchData = async () => {
         try {
            // Fetch data from the API
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            const products = await response.json();
            setProducts(products);
         } catch (error) {
            console.error('Error fetching data:', error);
         }
      };

      fetchData();
   }, []);

   const debouncedSearch = debounce((value) => {
      // Filter products based on the search input
      const filteredProducts = products.filter(product =>
         product.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredProducts);
   }, 500);

   const handleSearchChange = (event) => {
      const { value } = event.target;
      setSearch(value);
      debouncedSearch(value);
   };
   const handleSearchFieldClick = () => {
      // Programmatically focus on the TextField when clicked
      document.getElementById('searchTextField').focus();
   };

   // Show full product list when the search input is empty
   const showFullProductList = search.trim() === '';

   return (
      <Grid
         container
         direction='column'
         alignItems='center'
         justifyContent='center'
         className={classes.rowContainer}
      >
         <Grid item>
            <Typography variant='h4'>Product List</Typography>
         </Grid>
         <Grid item onClick={handleSearchFieldClick}>
            <TextField
               label='Search Products'
               variant='outlined'
               value={search}
               onChange={handleSearchChange}
               autoFocus
               id='searchTextField'
            />
         </Grid>
         <Grid
            item
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
         >
            {showFullProductList ? (
               products.map((product) => (
                  <Grid
                     item
                     style={{
                        maxWidth: '40em',
                        marginLeft: matchesXS ? 0 : matchesSM ? '1em' : matchesMD ? '2em' : '8em',
                     }}
                     key={product.id}
                  >
                     <ItemCards
                        id={product.id}
                        productName={product.title}
                        image={product.image}
                        price={product.price}
                        user={props.user}
                     />
                  </Grid>
               ))
            ) : (
               searchResults.map((product) => (
                  <Grid
                     item
                     style={{
                        maxWidth: '40em',
                        marginLeft: matchesXS ? 0 : matchesSM ? '1em' : matchesMD ? '2em' : '8em',
                     }}
                     key={product.id}
                  >
                     <ItemCards
                        id={product.id}
                        productName={product.title}
                        image={product.image}
                        price={product.price}
                        user={props.user}
                     />
                  </Grid>
               ))
            )}
         </Grid>
      </Grid>
   );
};

export default Search;