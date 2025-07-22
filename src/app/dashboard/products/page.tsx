
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 5;

export default function VendorProductsPage() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [products, setProducts] = useState<Snack[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Snack | null>(null);
    
    const currentPage = Number(searchParams.get('page')) || 1;
    
    const fetchProducts = async () => {
        setLoading(true);
        try {
                const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(ITEMS_PER_PAGE)
            });
            const response = await fetch(`/api/dashboard/products?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data.products || []);
            setTotalProducts(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch products.' });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

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

    const handleSaveProduct = async (productData: Omit<Snack, 'id' | 'vendorId' | 'reviews' | 'vendor' | 'createdAt' | 'updatedAt'>) => {
        const isEditing = !!selectedProduct;
        const url = isEditing ? `/api/dashboard/products/${selectedProduct.id}` : '/api/dashboard/products';
        const method = isEditing ? 'PUT' : 'POST';

        // Ensure only serializable data is sent
        const payload = {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            imageUrl: productData.imageUrl,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || (isEditing ? 'Failed to update product' : 'Failed to create product'));
            }
            
            toast({
                title: `Product ${isEditing ? 'Updated' : 'Created'}`,
                description: `"${productData.name}" has been successfully saved.`
            });

            fetchProducts(); // Refresh the list
            setIsProductDialogOpen(false); // Close the dialog on success
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Could not save product. ${error instanceof Error ? error.message : ''}`
            });
        }
    };
    
    const confirmDeleteProduct = async () => {
        if(selectedProduct) {
            try {
                const response = await fetch(`/api/dashboard/products/${selectedProduct.id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete product');
                
                toast({
                    title: "Product Deleted",
                    description: `"${selectedProduct.name}" has been removed.`
                });
                
                fetchProducts(); // Refresh the list
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not delete product.'
                });
            }
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
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : products.length > 0 ? (
                products.map(snack => (
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
                ))
            ) : (
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
