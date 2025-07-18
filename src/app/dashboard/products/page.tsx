
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Snack } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { ProductDialog } from "@/components/dashboard/ProductDialog";
import { DeleteProductDialog } from "@/components/dashboard/DeleteProductDialog";
import { PaginationComponent } from "@/components/shared/PaginationComponent";

const ITEMS_PER_PAGE = 5;

export default function VendorProductsPage() {
    const [products, setProducts] = useState<Snack[]>([]);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Snack | null>(null);
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/dashboard/products');
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }
        fetchProducts();
    }, []);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const paginatedProducts = products.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsProductDialogOpen(true);
    };

    const handleEditProduct = (product: Snack) => {
        setSelectedProduct(product);
        setIsProductDialogOpen(true);
    };

    const handleDeleteProduct = (product: Snack) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveProduct = (productData: Omit<Snack, 'id' | 'vendorId' | 'reviews' | 'vendor'>) => {
        if (selectedProduct) {
            // Edit existing product
            // setProducts(products.map(p => p.id === selectedProduct.id ? { ...selectedProduct, ...productData } : p));
        } else {
            // Add new product
            // const newProduct: Snack = {
            //     id: `snack-${Date.now()}`,
            //     ...productData,
            //     vendorId: 'vendor-1' // Assuming a static vendor for now
            // };
            // setProducts([newProduct, ...products]);
        }
    };
    
    const confirmDeleteProduct = () => {
        if(selectedProduct) {
            setProducts(products.filter(p => p.id !== selectedProduct.id));
        }
    }


  return (
    <>
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Your Products</CardTitle>
                    <CardDescription>Manage your snack offerings.</CardDescription>
                </div>
                <Button onClick={handleAddProduct}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map(snack => (
                <TableRow key={snack.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image
                        alt={snack.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={snack.imageUrl}
                        width="64"
                        data-ai-hint="snack food"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{snack.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{snack.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₦{snack.price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditProduct(snack)}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(snack)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
             {paginatedProducts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No products found. Add one to get started.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <PaginationComponent 
            totalPages={totalPages}
            currentPage={currentPage}
        />
      </CardFooter>
    </Card>

    <ProductDialog 
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSave={handleSaveProduct}
        product={selectedProduct}
    />

    <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteProduct}
        productName={selectedProduct?.name}
    />
    </>
  );
}
