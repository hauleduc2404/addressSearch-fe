import styles from "./Search.module.scss";
import { useEffect, useState } from "react";
import { getDistricts, getProvinces, getWards } from "../api/api";
import request from "../request";

function Search() {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [full, setTFull] = useState([]);
  const [t, setT] = useState();
  const [h, setH] = useState();
  const [x, setX] = useState();
  const [detail, setDetail] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  const hanldeSearch = (value) => {
    const valueNew = value.toLowerCase();
    let fullT = [];
    let fullH = [];
    let fullX = [];
    let ansT = [];
    let ansH = [];
    let ansX = [];
    let startT = [];
    let startH = [];
    let startX = [];
    let results = [];

    //Tìm theo Xã
    full.forEach((ele, index) => {
      startX[index] = ele[`wardName`]
        .toString()
        .split(" ")
        .map((e) => {
          return e[0];
        })
        .join("")
        .toLowerCase();

      if (!Number.isInteger(ele[`wardName`])) {
        fullX[index] = ele[`wardName`].toString().toLowerCase();
      }
    });
    startX.forEach((ele, index) => {
      if (ele === valueNew) {
        ansX.push(index);
      }
    });

    if (Array.isArray(fullX)) {
      fullX.forEach((ele, index) => {
        if (ele.includes(valueNew)) {
          ansX.push(index);
        }
      });
    }

    ansX.forEach((eleA) => {
      startX.forEach((eleX, index) => {
        if (eleA === index) {
          let idProvince = full[index][`provinceID`];
          let idDistrict = full[index][`districtID`];
          let addressProvince = province.find((ele) => {
            return ele[`provinceID`] === idProvince;
          });
          let addressDistrict = district.find((ele) => {
            return ele[`districtID`] === idDistrict;
          });

          const resultText =
            "Tìm theo xã: " +
            full[index][`wardName`] +
            " , " +
            addressDistrict[`districtName`] +
            " , " +
            addressProvince[`provinceName`];
          results.push(resultText);
        }
      });
    });

    // Tìm theo Huyện
    district.forEach((ele, index) => {
      startH[index] = ele[`districtName`]
        .split(" ")
        .map((e) => {
          return e[0];
        })
        .join("")
        .toLowerCase();

      fullH[index] = ele[`districtName`].toString().toLowerCase();
    });
    startH.forEach((ele, index) => {
      if (ele.includes(valueNew)) {
        ansH.push(index);
      }
    });

    if (Array.isArray(fullH)) {
      fullH.forEach((ele, index) => {
        if (ele === valueNew) {
          ansH.push(index);
        }
      });
    }

    ansH.forEach((eleA) => {
      startH.forEach((eleT, index) => {
        if (eleA === index) {
          let idProvince = district[index][`provinceID`];
          let addressProvince = province.find((ele) => {
            return ele[`provinceID`] === idProvince;
          });

          const resultText =
            "Tìm theo huyện: " +
            district[index][`districtName`] +
            " , " +
            addressProvince[`provinceName`];

          results.push(resultText);
        }
      });
    });

    // Tìm theo tỉnh
    province.forEach((ele, index) => {
      startT[index] = ele[`provinceName`]
        .split(" ")
        .map((e) => {
          return e[0];
        })
        .join("")
        .toLowerCase();

      fullT[index] = ele[`provinceName`].toString().toLowerCase();
    });
    startT.forEach((ele, index) => {
      if (ele.includes(valueNew)) {
        ansT.push(index);
      }
    });
    if (Array.isArray(fullT)) {
      fullT.forEach((ele, index) => {
        if (ele === valueNew) {
          ansT.push(index);
        }
      });
    }
    ansT.forEach((eleA) => {
      startT.forEach((eleT, index) => {
        if (eleA === index) {
          const resultText =
            "Tìm theo Tỉnh: " + province[index][`provinceName`];
          results.push(resultText);
        }
      });
    });
    setSearchResults(results);
    setIsSearchPerformed(true);
  };

  const handleT = (value) => {
    console.log(value);

    setT(
      province.find((e) => {
        return e?.provinceName === value;
      })?.provinceID
    );

    setH();
    setX();
    setDetail();
  };
  const handleH = (value) => {
    console.log("H: ", h);
    setH(
      district.find((ele) => {
        return ele?.districtName === value;
      })?.districtID
    );
    setX();
  };
  const handleX = (value) => {
    setX(
      full.find((ele) => {
        return ele?.wardName === value;
      })?.wardID
    );
  };

  const handleSubmit = () => {
    const resultText = `${
      province.find((ele) => ele.provinceID === t)?.provinceID || ""
    }, 
       ${district.find((ele) => ele.districtID === h)?.districtID || ""}, 
       ${full.find((ele) => ele.wardID === x)?.wardID || ""},  ${detail}`;

    setSearchResults([resultText]);
    setIsSearchPerformed(false);
  };

  const fetchProvince = async () => {
    const res = await getProvinces()
      .then((res) => {
        console.log("Res: ", res);
        setProvince([...res?.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDistrict = async () => {
    const res = await getDistricts()
      .then((res) => {
        console.log("Res: ", res);
        setDistrict([...res?.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchFull = async () => {
    const res = await getWards()
      .then((res) => {
        console.log("Res: ", res);
        setTFull([...res?.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProvince();
    fetchDistrict();
    fetchFull();
  }, []);

  return (
    <>
      <div className={styles.inputAddress}>
        <select
          className={styles.tinh}
          onChange={(e) => handleT(e.target.value)}
        >
          <option value={0}>{`Chọn Tỉnh`}</option>
          {province.map((ele, index) => {
            return <option key={index}>{ele[`provinceName`]}</option>;
          })}
        </select>
        <select
          className={styles.huyen}
          onChange={(e) => handleH(e.target.value)}
        >
          <option value = {0}>{`Chọn Quận Huyện`}</option>
          {t ? (
            district
              .filter((ele) => {
                return ele[`provinceID`] === t;
              })
              .map((eleH, index) => {
                return (
                  <option key={eleH?.districtID}>{eleH[`districtName`]}</option>
                );
              })
          ) : (
            <></>
          )}
        </select>
        <select className={styles.xa} onChange={(e) => handleX(e.target.value)}>
          <option value = {0}>{`Chọn Xã Phường`}</option>
          {h ? (
            full
              .filter((ele) => {
                return ele[`districtID`] === h;
              })
              .map((eleX, index) => {
                return <option key={eleX?.wardID}>{eleX[`wardName`]}</option>;
              })
          ) : (
            <></>
          )}
        </select>
        <input
          className={styles.detail}
          placeholder="Địa chỉ cụ thể "
          onChange={(e) => setDetail(e.target.value)}
          value={detail}
        ></input>
      </div>
      <button className={styles.btn} onClick={() => handleSubmit()}>
        Submit
      </button>
      <div>
        <input
          className={styles.search}
          placeholder="Tìm kiếm"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        ></input>
        <></>
        <button className={styles.btn} onClick={() => hanldeSearch(search)}>
          Search
        </button>
      </div>
      <div>
        {searchResults.length > 0 || isSearchPerformed ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index}>
                  <td>{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </>
  );
}

export default Search;