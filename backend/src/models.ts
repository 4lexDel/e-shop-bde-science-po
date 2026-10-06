import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db";

export class Product extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare priceCents: number;
  declare currency: string;
  declare theme: string;
  declare active: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    priceCents: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING(3), defaultValue: "eur" },
    theme: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, tableName: "products", timestamps: true },
);

export class Order extends Model {
  declare id: string;
  declare status: string;
  declare customerFirstName: string;
  declare customerLastName: string;
  declare customerEmail: string;
  declare addressLine1: string;
  declare addressLine2: string | null;
  declare postalCode: string;
  declare city: string;
  declare country: string;
  declare totalCents: number;
  declare stripeSessionId: string | null;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "CANCELED"),
      defaultValue: "PENDING",
    },
    customerFirstName: { type: DataTypes.STRING, allowNull: false },
    customerLastName: { type: DataTypes.STRING, allowNull: false },
    customerEmail: { type: DataTypes.STRING, allowNull: false },
    addressLine1: { type: DataTypes.STRING, allowNull: false },
    addressLine2: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING(2), allowNull: false },
    totalCents: { type: DataTypes.INTEGER, allowNull: false },
    stripeSessionId: { type: DataTypes.STRING, unique: true },
  },
  { sequelize, tableName: "orders", timestamps: true },
);

export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare name: string;
  declare unitPriceCents: number;
  declare quantity: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    unitPriceCents: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "order_items", timestamps: false },
);

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
