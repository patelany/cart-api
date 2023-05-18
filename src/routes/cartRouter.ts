import express from "express";
import { dummyCartItems } from "../dummyDB";
import { CartItem } from "../models/CartItem";

const cartRouter = express.Router();
let nextId: number = 6;

// build endpoints here
cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  if (maxPrice) {
    const filteredArray: CartItem[] = dummyCartItems.filter((item) => {
      return item.price <= +maxPrice;
    });
    res.status(200).json(filteredArray);
  } else if (prefix) {
    const filteredArray: CartItem[] = dummyCartItems.filter((item) => {
      return item.product.startsWith(prefix as string);
    });
    res.status(200).json(filteredArray);
  } else if (pageSize) {
    // const limitedArray: CartItem[] = [];
    // for (let i = 0; i < +pageSize; i++){
    //     limitedArray.push(dummyCartItems[i]);
    // }
    // res.status(200).json(limitedArray);
    const limitedArray: CartItem[] = dummyCartItems.slice(0, +pageSize);
    res.status(200).json(limitedArray);
  } else {
    res.status(200).json(dummyCartItems);
  }
});

cartRouter.get("/cart-items/:id", (req, res) => {
  const id: string = req.params.id;
  const cartItem: CartItem | undefined = dummyCartItems.find((item) => {
    return item.id === +id;
  });
  if (cartItem !== undefined) {
    res.status(200).json(cartItem);
  } else {
    res.status(404);
    res.json({ message: "ID Not Found" });
  }
});

cartRouter.post("/cart-items", (req, res) => {
  const newCartItem: CartItem = req.body;
  newCartItem.id = nextId;
  nextId++;
  dummyCartItems.push(newCartItem);
  res.status(201).json(newCartItem);
});

cartRouter.put("/cart-items/:id", (req, res) => {
  const idOfCartItemToReplace: number = +req.params.id;
  const updatedCartItem: CartItem = req.body;
  const foundIndex = dummyCartItems.findIndex((item) => {
    return item.id === idOfCartItemToReplace;
  });
  if (foundIndex !== -1) {
    dummyCartItems[foundIndex] = updatedCartItem;
    res.status(200).json(updatedCartItem);
  } else {
    res.status(404).json({
      message: "cart item not found with id: " + idOfCartItemToReplace,
    });
  }
});

cartRouter.delete("/cart-items/:id", (req, res) => {
  const idOfCartItemToDelete: number = +req.params.id;
  const foundIndex = dummyCartItems.findIndex((item) => {
    return item.id === idOfCartItemToDelete;
  });
  if (foundIndex !== -1) {
    dummyCartItems.splice(foundIndex, 1);
    res.status(204);
  } else {
    res.status(404).json({
      message: "cart item not found with id: " + idOfCartItemToDelete,
    });
  }
});

export default cartRouter;
