
// src/lib/templates/zapTemplates.ts

export const zapierTemplate = (data: any) => ({
  event: 'product_added',
  product: {
    name: data.name,
    price: data.price,
    category: data.category,
  },
  sent_at: new Date().toISOString()
});

export const airtableTemplate = (data: any) => ({
  fields: {
    ProductName: data.name,
    Price: data.price,
    Category: data.category
  }
});

export const notionTemplate = (data: any) => ({
  parent: { database_id: 'notion_db_id' },
  properties: {
    Name: {
      title: [{ text: { content: data.name } }]
    },
    Price: {
      number: data.price
    },
    Category: {
      select: { name: data.category }
    }
  }
});
