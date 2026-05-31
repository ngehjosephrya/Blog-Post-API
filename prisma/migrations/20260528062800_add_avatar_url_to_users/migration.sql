-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "avatarUrl" TEXT;

-- CreateIndex
CREATE INDEX "Comments_postId_idx" ON "Comments"("postId");

-- CreateIndex
CREATE INDEX "Comments_authorId_idx" ON "Comments"("authorId");

-- CreateIndex
CREATE INDEX "Likes_postId_idx" ON "Likes"("postId");

-- CreateIndex
CREATE INDEX "Posts_authorId_idx" ON "Posts"("authorId");

-- CreateIndex
CREATE INDEX "Posts_published_idx" ON "Posts"("published");

-- CreateIndex
CREATE INDEX "Posts_createdAt_idx" ON "Posts"("createdAt");
