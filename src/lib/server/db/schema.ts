import { pgTable, pgEnum, serial, varchar, integer, boolean, timestamp, text, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const rolesEnum = pgEnum('roles', ['Utente', 'Editor', 'Amministratore']);

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	surname: varchar('surname', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	roles: text('roles').array().notNull(),
	banned: boolean('banned').default(false).notNull(),
	created: timestamp('created').defaultNow().notNull(),
	updated: timestamp('updated').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	description: text('description'),
	backgroundColor: varchar('background_color', { length: 7 }).notNull(),
	textColor: varchar('text_color', { length: 7 }).notNull(),
});

export const articles = pgTable('articles', {
	id: serial('id').primaryKey(),
	authorId: integer('author_id').references(() => users.id).notNull(),
	content: text('content').notNull(),
	created: timestamp('created').defaultNow().notNull(),
	updated: timestamp('updated').defaultNow().notNull(),
	visibility: boolean('visibility').default(false).notNull(),
});

export const articlesTags = pgTable('articles_tags', {
	id: serial('id').primaryKey(),
	articleId: integer('article_id')
		.notNull()
		.references(() => articles.id, { onDelete: 'cascade' }),
	tagId: integer('tag_id')
		.notNull()
		.references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => [
	unique().on(table.articleId, table.tagId),
]);

export const articlesRelations = relations(articles, ({ many, one }) => ({
	tags: many(articlesTags),
	author: one(users, {
		fields: [articles.authorId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	articles: many(articles),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	articles: many(articlesTags),
}));

export const articlesTagsRelations = relations(articlesTags, ({ one }) => ({
	article: one(articles, {
		fields: [articlesTags.articleId],
		references: [articles.id],
	}),
	tag: one(tags, {
		fields: [articlesTags.tagId],
		references: [tags.id],
	}),
}));