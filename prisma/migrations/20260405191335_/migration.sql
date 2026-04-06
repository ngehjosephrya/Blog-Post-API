/*
  Warnings:

  - The primary key for the `_CategoriesToPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_PostsToTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CategoriesToPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_PostsToTags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CategoriesToPosts" DROP CONSTRAINT "_CategoriesToPosts_AB_pkey";

-- AlterTable
ALTER TABLE "_PostsToTags" DROP CONSTRAINT "_PostsToTags_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToPosts_AB_unique" ON "_CategoriesToPosts"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostsToTags_AB_unique" ON "_PostsToTags"("A", "B");
