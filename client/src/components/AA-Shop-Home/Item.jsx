import React, { useState, useEffect } from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Stack,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Item() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(products.length / rowsPerPage);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop:'21px'
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "15px", fontWeight: 500,fontFamily:'Poppins' }}>
      GET START
      YOUR FAVRIOT SHOPING
      </Typography>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products
          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
          .map((product) => {
            return (
              <Card
                key={product.id}
                style={{ width: "300px", margin: "10px", position: "relative" }}
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <CardContent>
                  <Typography
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {product.title}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "150px",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  {hoveredProductId === product.id && (
                    <Typography
                      variant="body1"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: 300,
                        color: "white",
                        padding: "5px",
                        position: "absolute",
                        bottom: "10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "orange",
                        borderRadius: "4px",
                        padding: "8px 16px",
                      }}
                    >
                      Price: ${product.price}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Stack spacing={2} sx={{ marginTop: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "orange",
                  color: "white",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "darkorange",
                },
              }}
            />
          )}
        />
      </Stack>
    </div>
  );
}

export default Item;
