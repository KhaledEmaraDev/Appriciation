import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Paper from "@material-ui/core/Paper";
import SearchBar from "./SearchBar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    overflowX: "auto"
  },
  subheader: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(theme.typography.fontSize),
    boxSizing: "border-box",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    lineHeight: 1.5
  },
  thumbnail: {
    width: "100%"
  }
}));

export default function ProductSpecs(props) {
  const router = useRouter();
  const classes = useStyles();
  const {
    brand,
    product,
    specs,
    comparedBrand,
    comparedProduct,
    comparedSpecs
  } = props;

  const isComparison = specs && comparedBrand && comparedSpecs;

  if (!specs && !comparedSpecs)
    return (
      <Paper className={classes.root} elevation={25}>
        <Typography className={classes.subheader}>
          التفاصيل قادمة قريباً
        </Typography>
      </Paper>
    );

  function handleSearchClick(suggestion) {
    router.push(
      `/comparison?brand=${encodeURIComponent(
        brand
      )}&product=${encodeURIComponent(
        product
      )}&comparedBrand=${encodeURIComponent(
        suggestion.brand
      )}&comparedProduct=${encodeURIComponent(suggestion.product)}`,
      `/comparison/${encodeURIComponent(brand)}/${encodeURIComponent(
        product
      )}/${encodeURIComponent(suggestion.brand)}/${encodeURIComponent(
        suggestion.product
      )}`
    );
  }

  function createData(name, value) {
    return { name, value };
  }

  function getCameraValue(cameras, index) {
    return `${cameras[index].size} MP${
      cameras[index].aperture ? `, f/${cameras[index].aperture}` : ""
    }${cameras[index].sensor_size ? `, ${cameras[index].sensor_size}"` : ""}${
      cameras[index].pixel_size ? `, ${cameras[index].pixel_size}µm` : ""
    }${cameras[index].features ? `, ${cameras[index].features}` : ""}`;
  }

  function getRows(spec) {
    const main_cameras = spec.camera.filter(item => !item.front);
    const front_cameras = spec.camera.filter(item => item.front);

    return [
      createData(
        "السعر",
        spec.price ? `${spec.price} جنيه مصري` : "لم يحدد بعد"
      ),
      createData(
        "تاريخ الإصدار",
        spec.publish_date
          ? new Date(spec.publish_date).toLocaleDateString()
          : "لم يعلن بعد"
      ),
      createData(
        "أبعاد الجسم",
        spec.dimensions
          ? `${spec.dimensions.width}mm x ${spec.dimensions.height}mm x ${spec.dimensions.depth}mm`
          : "لا بيانات لدينا"
      ),
      createData(
        "شريحة الاتصال",
        spec.sim && spec.sim.length > 0
          ? spec.sim.length > 1
            ? `Dual Sims (${spec.sim[0]}, ${spec.sim[1]})`
            : spec.sim[0]
          : "لا بيانات لدينا"
      ),
      createData("نوع الشاشة", spec.display ? spec.display : "لا بيانات لدينا"),
      createData("حجم الشاشة", spec.size ? `${spec.size}"` : "لا بيانات لدينا"),
      createData(
        "أبعاد الشاشة",
        spec.resolution
          ? `${spec.resolution.width} * ${spec.resolution.height}`
          : "لا بيانات لدينا"
      ),
      createData(
        "حماية الشاشة",
        spec.protection ? spec.protection : "لا بيانات لدينا"
      ),
      createData(
        "نسبة أبعاد الشاشة",
        spec.aspect_ratio ? `${spec.aspect_ratio}` : "لا بيانات لدينا"
      ),
      createData(
        "دقة الشاشة",
        spec.ppi ? `${spec.ppi} ppi` : "لا بيانات لدينا"
      ),
      createData(
        "نظام التشغيل",
        spec.os
          ? `${spec.os.name} ${spec.os.version} (${spec.os.skin})`
          : "لا بيانات لدينا"
      ),
      createData(
        "شريحة المعالج",
        spec.soc && spec.soc.name ? spec.soc.name : "لا بيانات لدينا"
      ),
      createData(
        "المعالج المركزي",
        spec.soc && spec.soc.cpu ? spec.soc.cpu : "لا بيانات لدينا"
      ),
      createData(
        "معالج الرسوميات",
        spec.soc && spec.soc.gpu ? spec.soc.gpu : "لا بيانات لدينا"
      ),
      createData(
        "الرام",
        spec.storage && spec.storage.length > 0
          ? `${spec.storage[0].ram}GB${
              spec.storage.length > 1 ? `, ${spec.storage[1].ram}GB` : ""
            }${spec.storage.length > 2 ? `, ${spec.storage[2].ram}GB` : ""}`
          : "لا بيانات لدينا"
      ),
      createData(
        "الذاكرة الداخلية",
        spec.storage && spec.storage.length > 0
          ? `${spec.storage[0].internal}GB${
              spec.storage.length > 1 ? `, ${spec.storage[1].internal}GB` : ""
            }${
              spec.storage.length > 2 ? `, ${spec.storage[2].internal}GB` : ""
            }`
          : "لا بيانات لدينا"
      ),
      createData(
        "الذاكرة الخارجية",
        spec.storage && spec.storage.length > 0
          ? `${
              spec.storage.length > 0
                ? `${spec.storage[0].external}GB`
                : "لا يوجد"
            }${
              spec.storage.length > 1 ? `, ${spec.storage[1].external}GB` : ""
            }${
              spec.storage.length > 2 ? `, ${spec.storage[2].external}GB` : ""
            }`
          : "لا بيانات لدينا"
      ),
      createData(
        "أول كاميرا خلفية",
        main_cameras && main_cameras.length > 0
          ? getCameraValue(main_cameras, 0)
          : "لا يوجد"
      ),
      createData(
        "ثاني كاميرا خلفية",
        main_cameras && main_cameras.length > 1
          ? getCameraValue(main_cameras, 1)
          : "لا يوجد"
      ),
      createData(
        "ثالث كاميرا خلفية",
        main_cameras && main_cameras.length > 2
          ? getCameraValue(main_cameras, 2)
          : "لا يوجد"
      ),
      createData(
        "رابع كاميرا خلفية",
        main_cameras && main_cameras.length > 3
          ? getCameraValue(main_cameras, 3)
          : "لا يوجد"
      ),
      createData(
        "أول كاميرا أمامية",
        front_cameras && front_cameras.length > 0
          ? getCameraValue(front_cameras, 0)
          : "لا يوجد"
      ),
      createData(
        "ثاني كاميرا أمامية",
        front_cameras && front_cameras.length > 1
          ? getCameraValue(front_cameras, 1)
          : "لا يوجد"
      ),
      createData("مخرج السماعات", spec.audio_jack ? "يوجد" : "لا يوجد"),
      createData(
        "شبكة لا سلكية",
        spec.wlan
          ? `Wi-Fi 802.11 b/g/n${spec.wlan.ac ? "/ac" : ""}${
              spec.wlan.ax ? "/ax" : ""
            }${spec.wlan.dual_band ? ", Dual Band" : ""}${
              spec.wlan.wifi_direct ? ", Wi-Fi Direct" : ""
            }${spec.wlan.hotspot ? ", Hotspot" : ""}`
          : "لا يدعم"
      ),
      createData("شبكة الجيل الرابع", spec["4g"] ? "يدعم" : "لا يدعم"),
      createData(
        "بلوتوث",
        spec.bluetooth
          ? `${spec.bluetooth.version}${spec.wlan.a2dp ? ", A2DP" : ""}${
              spec.wlan.le ? ", LE" : ""
            }${spec.wlan.aptx ? ", aptX" : ""}`
          : "لا يوجد"
      ),
      createData("نظام تحديد المواقع (gps)", spec.gps ? "يدعم" : "لا يدعم"),
      createData("الاتصال قريب المدى (nfc)", spec.nfc ? "يدعم" : "لا يدعم"),
      createData("ريموت أشعة تحت الحمراء", spec.ir ? "يدعم" : "لا يدعم"),
      createData("راديو", spec.radio ? "يدعم" : "لا يدعم"),
      createData(
        "مخرج اتصال البيانات (usb)",
        spec.usb
          ? `${spec.usb.version}${
              spec.usb.type_c ? ", Type-C 1.0 reversible connector" : ""
            }`
          : "لا يدعم"
      ),
      createData(
        "المستشعرات",
        spec.sensors
          ? `${spec.sensors.gyro ? "gyroscope" : ""}${
              spec.sensors.others ? `, ${spec.sensors.others}` : ""
            }`
          : "لا يوجد"
      ),
      createData(
        "مستشعر البصمة",
        spec.fingerprint
          ? `${`fingerprint (${spec.fingerprint.location} ${spec.fingerprint.type})`}`
          : "لا يوجد"
      ),
      createData("ميزات أخرى", spec.features ? spec.features : "لا يوجد"),
      createData(
        "الألوان",
        spec.colors
          ? spec.colors.map(
              (item, index) =>
                `${item}${index + 1 !== spec.colors.length ? ", " : ""}`
            )
          : "غير متوفر"
      ),
      createData(
        "البطارية",
        spec.battery
          ? `${spec.battery.removable ? "Removable" : "Non-Removable"} Li-Po ${
              spec.battery.capacity
            } mAh`
          : "غير متوفر"
      ),
      createData(
        "الشحن",
        spec.battery
          ? `${spec.battery.charging ? `${spec.battery.charging}W ` : ""}${
              spec.battery.charging_tech
                ? spec.battery.charging_tech
                : "لا شحن سريع"
            }`
          : "غير متوفر"
      )
    ];
  }

  const rows = getRows(specs || comparedSpecs);
  const comparedRows = isComparison ? getRows(comparedSpecs) : null;

  return (
    <Paper className={classes.root} elevation={25}>
      <Typography
        className={classes.subheader}
        component="h1"
        variant="subtitle2"
      >
        {!isComparison
          ? `مواصفات تطبيق ${specs ? brand : comparedBrand} ${
              specs ? product : comparedProduct
            }`
          : `مقارنة ما بين تطبيقي ${brand} ${product} و ${comparedBrand} ${comparedProduct}`}
      </Typography>
      <SearchBar
        id="compare-product-search"
        placeholder="قارن مع منتج أخر"
        handleSuggestionSelected={handleSearchClick}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نقطة المقارنة</TableCell>
            <TableCell align="right">{`مواصفات تطبيق ${brand} ${product}`}</TableCell>
            {isComparison && (
              <TableCell align="right">{`مواصفات تطبيق ${comparedBrand} ${comparedProduct}`}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {isComparison && (
            <TableRow>
              <TableCell component="th" scope="row">
                صورة التطبيق
              </TableCell>
              <TableCell>
                <img
                  loading="auto"
                  className={classes.thumbnail}
                  src={`https://d3tygoy974vfbk.cloudfront.net/images/apps/${encodeURIComponent(
                    `${brand} ${product}`
                  )}.jpg`}
                  alt={`${brand} ${product}`}
                />
              </TableCell>
              <TableCell>
                <img
                  loading="auto"
                  className={classes.thumbnail}
                  src={`https://d3tygoy974vfbk.cloudfront.net/images/apps/${encodeURIComponent(
                    `${comparedBrand} ${comparedProduct}`
                  )}.jpg`}
                  alt={`${comparedBrand} ${comparedProduct}`}
                />
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
              {isComparison && (
                <TableCell align="right">{comparedRows[index].value}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

ProductSpecs.propTypes = {
  brand: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  specs: PropTypes.object,
  comparedBrand: PropTypes.string,
  comparedProduct: PropTypes.string,
  comparedSpecs: PropTypes.object
};
