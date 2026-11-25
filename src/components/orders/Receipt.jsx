import React from "react";
import { View, Text } from "react-native";
import styles from "../../assets/styles/receipt.styles";
import { money, formatDate, formatTime, addressLine } from "../../utils/format";

const TEETH = 30;

// فاتورة بشكل ريسيت الكاشير (أبيض وأسود)
// بتتعرض قبل التأكيد (من السلة) وممكن تتعرض لطلب موجود (orderNumber + date)
export default function Receipt({ items, subtotal, deliveryFee, total, customerName, delivery, orderNumber, date }) {
  const when = date || new Date();

  return (
    <View>
      <View style={styles.paper}>
        <Text style={styles.brand}>لقطة</Text>
        <Text style={styles.subtitle}>فاتورة طلب</Text>
        <View style={styles.dashed} />

        {orderNumber ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>رقم الطلب</Text>
            <Text style={styles.metaValue}>#{orderNumber}</Text>
          </View>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>التاريخ</Text>
          <Text style={styles.metaValue}>
            {formatDate(when)} - {formatTime(when)}
          </Text>
        </View>
        {!!customerName && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>العميل</Text>
            <Text style={styles.metaValue}>{customerName}</Text>
          </View>
        )}
        {!!delivery && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>العنوان</Text>
            <Text style={styles.metaValue}>
              {addressLine(delivery)}
            </Text>
          </View>
        )}
        <View style={styles.dashed} />

        {/* الجدول: الصنف | الكمية | السعر */}
        <View style={styles.headRow}>
          <Text style={[styles.headText, styles.colName]}>الصنف</Text>
          <Text style={[styles.headText, styles.colQty]}>الكمية</Text>
          <Text style={[styles.headText, styles.colPrice]}>السعر</Text>
        </View>
        {items.map((i, idx) => (
          <View key={`${i.product || i.name}-${idx}`} style={styles.row}>
            <View style={styles.colName}>
              <Text style={styles.cellName} numberOfLines={2}>
                {i.name}
              </Text>
              <Text style={[styles.cellSub, { textAlign: "right" }]}>
                {i.unitPrice.toFixed(2)}
                {i.unit ? ` / ${i.unit}` : ""}
              </Text>
            </View>
            <Text style={[styles.cellText, styles.colQty]}>
              {i.quantity}
              {i.unit ? ` ${i.unit}` : ""}
            </Text>
            <Text style={[styles.cellText, styles.colPrice]}>
              {(i.lineTotal ?? i.unitPrice * i.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.dashed} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>المجموع الفرعي</Text>
          <Text style={styles.totalValue}>{money(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>رسوم التوصيل</Text>
          <Text style={styles.totalValue}>{money(deliveryFee)}</Text>
        </View>
        <View style={styles.dashed} />
        <View style={styles.totalRow}>
          <Text style={styles.grandLabel}>الإجمالي</Text>
          <Text style={styles.grandValue}>{money(total)}</Text>
        </View>
        <View style={styles.dashed} />

        <Text style={styles.thanks}>شكراً لتسوقكم من لقطة</Text>
        <Text style={styles.barcode}>||| || ||| | |||| || |||</Text>
      </View>

      {/* حافة مسننة */}
      <View style={styles.zigzag}>
        {Array.from({ length: TEETH }).map((_, i) => (
          <View key={i} style={styles.zigzagTooth} />
        ))}
      </View>
    </View>
  );
}
