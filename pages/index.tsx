import Head from "next/head";
import { useEffect, useState } from "react";
import { getCompanies, getIndusties, getPositions } from "../services/data";
import styles from "../styles/Home.module.css";

export default function Home(props) {
    const [baseUrl, setBaseUrl] = useState(
        "https://airtable.com/embed/shrLPYBgoHmRUSzpR?backgroundColor=yellow&viewControls=on"
    );
    let selectedIndustry = "";
    let selectedCompany = "";
    let selectedPosition = "";

    function resetIndustry() {
        selectedIndustry = "";
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function filterByIndustry(val) {
        val = encodeURIComponent(val);
        selectedIndustry = val;
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function onIndustryUpdate() {
        const val = (document.getElementById("industry-btn") as HTMLSelectElement).value;
        if (val == "") {
            resetIndustry();
        } else {
            filterByIndustry(val);
        }
    }

    function onCompanyUpdate() {
        const val = (document.getElementById("company-btn") as HTMLSelectElement).value;
        if (val == "") {
            resetCompany();
        } else {
            filterByCompany(val);
        }
    }

    function onPositionUpdate() {
        const val = (document.getElementById("position-btn") as HTMLSelectElement).value;
        if (val == "") {
            resetPosition();
        } else {
            filterByPosition(val);
        }
    }

    function resetCompany() {
        selectedCompany = "";
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function filterByCompany(val) {
        val = encodeURIComponent(val);
        selectedCompany = val;
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function resetPosition() {
        selectedPosition = "";
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function filterByPosition(val) {
        val = encodeURIComponent(val);
        selectedPosition = val;
        updateiframeUrl(selectedIndustry, selectedCompany, selectedPosition);
    }

    function updateiframeUrl(industry, company, position) {
        const iframe = document.getElementsByTagName("iframe")[0];

        if (industry != "") {
            iframe.src = baseUrl + "&filter_Industry%2F行業=" + industry;
        } else {
            iframe.src = baseUrl;
        }

        if (company != "") {
            iframe.src = iframe.src + "&filter_Company%2F公司=" + company;
        } else {
            if (industry == "") {
                iframe.src = baseUrl;
            }
        }

        if (position != "") {
            iframe.src = iframe.src + "&filter_Position%2F職位=" + position;
        }
    }

    function resetTableSize() {
        const h = window.innerHeight;
        const w = window.innerWidth;
        const iframe = document.getElementsByTagName("iframe")[0];

        iframe.style.width = w + "px";
        iframe.style.marginTop = "110px";
        iframe.style.height = h - 50 - 60 + "px";
    }

    function initControls() {
        const industryBtn = document.getElementById("industry-btn");
        const companyBtn = document.getElementById("company-btn");
        const positionBtn = document.getElementById("position-btn");

        const industryOption = new Option("Industry/行業", "");
        industryOption.style.textAlign = "center";
        industryBtn.append(industryOption);
        for (let i = 0; i < props.industries.length; i++) {
            let tmp = new Option(props.industries[i], props.industries[i]);
            tmp.style.textAlign = "center";
            industryBtn.append(tmp);
        }

        let companyOption = new Option("Company/公司", "");
        companyOption.style.textAlign = "center";
        companyBtn.append(companyOption);
        for (let i = 0; i < props.companies.length; i++) {
            let tmp = new Option(props.companies[i], props.companies[i]);
            tmp.style.textAlign = "center";
            companyBtn.append(tmp);
        }

        let positionOption = new Option("Position/職位", "");
        positionOption.style.textAlign = "center";
        positionBtn.append(positionOption);
        for (let i = 0; i < props.positions.length; i++) {
            let tmp = new Option(props.positions[i], props.positions[i]);
            tmp.style.textAlign = "center";
            positionBtn.append(tmp);
        }
    }

    useEffect(() => {
        resetTableSize();

        window.onresize = function (event) {
            resetTableSize();
        };

        initControls();
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Hong Kong Salary Records/香港薪酬一覽</title>
                <meta name="description" content="A table that collect salary data in Hong Kong" />
                <link rel="icon" href="/favicon.ico" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-S3TRSS0T5M"></script>
            </Head>

            <main className={styles.main}>
                <div
                    style={{
                        position: "fixed",
                        height: "35px",
                        textAlign: "center",
                        top: "10px",
                        fontSize: "14px",
                        left: "0px",
                        right: "0px"
                    }}
                >
                    <a href="https://airtable.com/shrsKTK4FZnOIYiX6" target="_blank" className={styles.submit_btn}>
                        Submit your record/新增你的薪酬紀錄
                    </a>
                </div>

                <div
                    id="industry-btn-container"
                    style={{
                        position: "fixed",
                        height: "35px",
                        textAlign: "center",
                        top: "50px",
                        fontSize: "14px",
                        left: "0px",
                        right: "0px"
                    }}
                >
                    <select
                        onChange={() => onIndustryUpdate()}
                        id="industry-btn"
                        className={styles.filter_btn + " " + styles.industry_btn}
                    ></select>

                    <select
                        onChange={() => onCompanyUpdate()}
                        id="company-btn"
                        className={styles.filter_btn + " " + styles.company_btn}
                    ></select>

                    <select
                        onChange={() => onPositionUpdate()}
                        id="position-btn"
                        className={styles.filter_btn + " " + styles.position_btn}
                    ></select>
                </div>

                <iframe
                    className="airtable-embed"
                    src="https://airtable.com/embed/shrLPYBgoHmRUSzpR?backgroundColor=yellow&viewControls=on"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    style={{ display: "block", background: "transparent" }}
                ></iframe>
            </main>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const industries = getIndusties();
    const companies = getCompanies();
    const positions = getPositions();

    return {
        props: { industries, companies, positions }
    };
}
