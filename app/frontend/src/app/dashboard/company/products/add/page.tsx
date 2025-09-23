"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getSession } from '@/lib/auth-client';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    productType: 'product',
    shortDescription: '',
    detailedDescription: '',
    productImageUrl: '',
    paymentModel: '',
    indicativeIncentive: '',
    salesTrainingAvailable: false,
    isActive: true,
    isPublished: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, productType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = async () => {
        try {
            const { data } = await getSession();

            const userId = data?.session.userId;

            const URL = `${process.env.NEXT_PUBLIC_API_URL}/protected/products/${userId}`;
            const body = { ...formData };
            const options: RequestInit = {
                method: 'POST',
                credentials: 'include' as RequestCredentials,
                body: JSON.stringify(body),
            }

            const response = await fetch(URL, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Product added successfully:', result);
        } catch (error) {
            console.error('Error adding product:', error);
            console.log(formData);
        }
    };

    submitData();
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className="block mb-2">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="productType" className="block mb-2">Product Type</Label>
            <Select value={formData.productType} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="shortDescription" className="block mb-2">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Enter a short description"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="detailedDescription" className="block mb-2">Detailed Description</Label>
            <Textarea
              id="detailedDescription"
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleChange}
              placeholder="Enter a detailed description"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="productImageUrl" className="block mb-2">Product Image URL</Label>
            <Input
              id="productImageUrl"
              name="productImageUrl"
              value={formData.productImageUrl}
              onChange={handleChange}
              placeholder="Enter product image URL"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="paymentModel" className="block mb-2">Payment Model</Label>
            <Input
              id="paymentModel"
              name="paymentModel"
              value={formData.paymentModel}
              onChange={handleChange}
              placeholder="Enter payment model"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="indicativeIncentive" className="block mb-2">Indicative Incentive</Label>
            <Input
              id="indicativeIncentive"
              name="indicativeIncentive"
              value={formData.indicativeIncentive}
              onChange={handleChange}
              placeholder="Enter indicative incentive"
            />
          </div>
          <div className="mb-4">
            <Checkbox
              id="salesTrainingAvailable"
              name="salesTrainingAvailable"
              checked={formData.salesTrainingAvailable}
              onCheckedChange={(checked) =>
                handleCheckboxChange('salesTrainingAvailable', checked as boolean)
              }
            />
            <Label htmlFor="salesTrainingAvailable" className="ml-2">Sales Training Available</Label>
          </div>
          <div className="mb-4">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                handleCheckboxChange('isActive', checked as boolean)
              }
            />
            <Label htmlFor="isActive" className="ml-2">Active</Label>
          </div>
          <div className="mb-4">
            <Checkbox
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) =>
                handleCheckboxChange('isPublished', checked as boolean)
              }
            />
            <Label htmlFor="isPublished" className="ml-2">Published</Label>
          </div>
          <Button type="submit" className="w-full">Add Product</Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProductPage;