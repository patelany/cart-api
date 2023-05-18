import express from "express";
import { dummyCartItems } from "../dummyDB";
import { CartItem } from "../models/CartItem";

const cartRouter = express.Router();
let nextId: number = dummyCartItems.length + 1;

cartRouter.get("/cart-items", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let temporaryCart: CartItem[] = dummyCartItems;
  if (maxPrice) {
    temporaryCart = temporaryCart.filter((item) => {
      return item.price <= +maxPrice;
    });
  }
  if (prefix) {
    temporaryCart = temporaryCart.filter((item) => {
      return item.product.startsWith(prefix as string);
    });
  }
  if (pageSize) {
    temporaryCart = temporaryCart.slice(0, +pageSize);
  }
  res.status(200).json(temporaryCart);
});

cartRouter.get("/cart-items/:id", (req, res) => {
  // get id from path param
  const pathParamId: number = parseInt(req.params.id);
  // look for item with that id
  const itemThatImLookingFor: CartItem | undefined = dummyCartItems.find(
    (item) => item.id === pathParamId
  );
  if (itemThatImLookingFor !== undefined) {
    // we found that item by the path param
    res.status(200).json(itemThatImLookingFor);
  } else {
    // didn't find anything with that path param
    res.status(404).json("ID Not Found");
  }
});

cartRouter.post("/cart-items", (req, res) => {
  const newCartItem: CartItem = req.body;
  newCartItem.id = nextId;
  nextId++;
  dummyCartItems.push(newCartItem);
  res.status(201).json(newCartItem);
});

cartRouter.put("/cart-items/:zebraId", (req, res) => {
  // req body tell us how to replace an obj
  const updatedCartItem: CartItem = req.body;
  // path param point to which thing to replace
  const idOfCartItemToReplace: string = req.params.zebraId;
  // use that path param id to find location of obj to replace
  const foundIndex = dummyCartItems.findIndex(
    (temp) => temp.id === +idOfCartItemToReplace
  );
  if (foundIndex !== -1) {
    // replace obj from found location with data from body
    dummyCartItems[foundIndex] = updatedCartItem;
    res.status(200).json(updatedCartItem);
  } else {
    res
      .status(404)
      .json({ message: "nothing found with id: " + idOfCartItemToReplace });
  }
});

cartRouter.delete("/cart-items/:idToDelete", (req, res) => {
  // grab id from path param
  const idOfThingToDelete: number = +req.params.idToDelete;
  // use that id to find location (index), so that we can delete it
  const foundIndex: number = dummyCartItems.findIndex((object) => {
    // return a number (index) based on this condition:
    // one of our objs has an id property === path param as a number
    return object.id === idOfThingToDelete;
  });
  // if it finds that thing: (not -1)
  if (foundIndex !== -1) {
    // we found it
    // delete it
    dummyCartItems.splice(foundIndex, 1);
    // delete only http method dont send body - instead use sendStatus
    res.sendStatus(204); // 204 - no content (successful, nothing to see)
  } else {
    // if we didn't find it, don't delete and send 404
    res.status(404).json({ message: "ID not found" });
  }
});

export default cartRouter;
