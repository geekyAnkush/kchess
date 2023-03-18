"use client";
import { IconUser } from "@tabler/icons-react";
import Link from "next/link";
// import ThemeToggle from "./ThemeToggle";
import { SessionContext } from "@/context/session";
import { useContext, useEffect, useState } from "react";

export default function Navbar() {
  const { connectWallet, account, error } = useContext(SessionContext);
  const [truncated, setTruncated] = useState("");
  const shortenAddress = (address) =>
    `${address?.slice(0, 5)}...${address?.slice(address.length - 4)}`;
  useEffect(() => {
    const temp = shortenAddress(account);
    setTruncated(temp);
  }, [account]);
  return (
    <div className="navbar bg-[#141414]">
      <div className="logo">
        <svg viewBox="0 0 37 75">
          <desc>Created with sketchtool.</desc>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              id="1440_-HOMEPAGE-next"
              transform="translate(-77.000000, -8118.000000)"
              fill="#FFFFFF"
            >
              <g id="footer" transform="translate(77.000000, 8118.000000)">
                <g id="Logo-2">
                  <g id="Logo">
                    <g>
                      <polygon
                        id="Fill-1"
                        points="13 47.7370666 17.0886076 51.6937566 17.0886076 68.2764542 17.1518987 68.2764542 24.0759494 75 31 68.2764542 26.8721519 64.2816601 26.8721519 47.7370666 19.9367089 41"
                      ></polygon>
                      <polygon id="Fill-2" points="13 33 20 26 27 33 20 40"></polygon>
                      <polygon
                        id="Fill-3"
                        points="7.43862661 0 0 7.85478548 0 68 9.28927039 58.3623029 9.39742489 44.7610561 5.1193133 40.3212321 9.30128755 35.9823982 9.28927039 11.7086175 14 6.81994866"
                      ></polygon>
                      <g id="Trademark" transform="translate(33.000000, 67.000000)">
                        <path
                          d="M3.362375,3.13725 C3.287375,3.33725 3.174875,3.51225 3.037375,3.64975 C2.899875,3.79975 2.737375,3.91225 2.537375,3.99975 C2.349875,4.08725 2.138625,4.12475 1.912375,4.12475 C1.687375,4.12475 1.474875,4.08725 1.274875,3.99975 C1.074875,3.91225 0.912375,3.79975 0.774875,3.64975 C0.637375,3.49975 0.524875,3.32475 0.449875,3.13725 C0.374875,2.93725 0.324875,2.72475 0.324875,2.49975 C0.324875,2.276 0.362375,2.0635 0.449875,1.86225 C0.524875,1.66225 0.637375,1.4885 0.774875,1.34975 C0.912375,1.19975 1.087375,1.08725 1.274875,0.99975 C1.474875,0.9135 1.674875,0.87475 1.912375,0.87475 C2.138625,0.87475 2.349875,0.9135 2.537375,0.99975 C2.724875,1.08725 2.899875,1.19975 3.037375,1.34975 C3.174875,1.49975 3.287375,1.66225 3.362375,1.86225 C3.438625,2.0635 3.487375,2.276 3.487375,2.49975 C3.474875,2.72475 3.438625,2.93725 3.362375,3.13725 M3.624875,1.76225 C3.524875,1.5385 3.399875,1.3385 3.224875,1.176 C3.049875,1.01225 2.849875,0.87475 2.624875,0.77475 C2.399875,0.67475 2.162375,0.62475 1.899875,0.62475 C1.637375,0.62475 1.399875,0.67475 1.162375,0.77475 C0.938625,0.87475 0.737375,1.01225 0.562375,1.176 C0.387375,1.3385 0.263625,1.5385 0.162375,1.76225 C0.074875,1.99975 0.024875,2.23725 0.024875,2.49975 C0.024875,2.76225 0.074875,3.001 0.174875,3.23725 C0.274875,3.46225 0.412375,3.66225 0.576125,3.8385 C0.737375,4.01225 0.949875,4.13725 1.174875,4.23725 C1.399875,4.32475 1.649875,4.37475 1.899875,4.37475 C2.162375,4.37475 2.399875,4.32475 2.624875,4.22475 C2.849875,4.12475 3.049875,3.9885 3.224875,3.82475 C3.399875,3.64975 3.524875,3.46225 3.624875,3.22475 C3.724875,3.001 3.774875,2.74975 3.774875,2.49975 C3.774875,2.23725 3.724875,1.99975 3.624875,1.76225"
                          id="Fill-4"
                        ></path>
                        <path
                          d="M2.088,2.3755 L1.8505,2.3755 L1.463,2.3755 L1.463,1.63675 L2.06175,1.63675 C2.12425,1.63675 2.188,1.63675 2.2505,1.6505 C2.313,1.663 2.37425,1.67425 2.413,1.7005 C2.463,1.72425 2.5005,1.763 2.53675,1.813 C2.5755,1.863 2.58675,1.9255 2.58675,2.013 C2.58675,2.113 2.563,2.19925 2.513,2.24925 C2.463,2.29925 2.4005,2.338 2.32425,2.36175 C2.263,2.36175 2.17425,2.3755 2.088,2.3755 M2.6755,2.438 C2.738,2.388 2.7755,2.338 2.813,2.26175 C2.84925,2.188 2.86175,2.09925 2.86175,1.99925 C2.86175,1.8255 2.813,1.68675 2.69925,1.6005 C2.58675,1.5005 2.4005,1.4505 2.12425,1.4505 L1.213,1.4505 L1.213,3.538 L1.4755,3.538 L1.4755,2.57425 L1.9505,2.57425 L2.54925,3.538 L2.86175,3.538 L2.22425,2.57425 C2.313,2.57425 2.4005,2.56175 2.48675,2.538 C2.54925,2.52425 2.613,2.488 2.6755,2.438"
                          id="Fill-6"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div className="nav">
        <ul>
          <li>
            <Link href="/play">Play</Link>
            <div className="rec"></div>
          </li>
          <li>
            <a href="chess.com/lessons" target="_blank">
              Learn
            </a>
            <div className="rec2"></div>
          </li>
          <li>
            <Link href="/explore">Watch</Link>
            <div className="rec3"></div>
          </li>
          <li>
            <a href="/">About</a>
            <div className="rec4"></div>
          </li>
          {/* <li>
            <a href="/">Legacy</a>
            <div className="rec5"></div>
          </li> */}
        </ul>
      </div>
      <div className="signin">
        <label
          tabIndex={0}
          htmlFor="auth-modal"
          className="btn btn-ghost btn-circle avatar -translate-x-5"
        >
          <div className="w-10 rounded-full">
            <IconUser className="m-auto block h-full" />
          </div>
        </label>
        {!account ? (
          <button onClick={connectWallet}>Connect</button>
        ) : (
          <span className="rounded-xl bg-gray-50 p-2 text-sm text-black">{truncated}</span>
        )}
        <div className="dropdown">
          <svg viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 3H3V1H1V3Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 9H3V7H1V9Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 15H3V13H1V15Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 3H9V1H7V3Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13 3H15V1H13V3Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 9H9V7H7V9Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13 9H15V7H13V9Z" fill="white"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 15H9V13H7V15Z" fill="white"></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 15H15V13H13V15Z"
              fill="white"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

/*
<header className="navbar mx-1 w-auto justify-center drop-shadow-sm md:mx-16 lg:mx-40">
      <div className="flex flex-1 items-center gap-1">
        <Link
          href="/"
          className="btn btn-ghost no-animation p-0 text-xl normal-case hover:bg-transparent"
        >
          kchess
        </Link>
        <div className="dropdown dropdown-right hover:dropdown-open">
          <label tabIndex={0} className="badge badge-sm cursor-help">
            alpha
          </label>
          <div
            tabIndex={0}
            className="dropdown-content card card-compact bg-primary text-primary-content w-64 shadow"
          >
            <div className="card-body cursor-default">
              <p className="text-left text-xs">
                This project is a work in progress. You can view the roadmap{" "}
                <a
                  href="https://github.com/users/geekyAnkush"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-none">
        <ThemeToggle />
        <label tabIndex={0} htmlFor="auth-modal" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <IconUser className="m-auto block h-full" />
          </div>
        </label>
      </div>
      <div>
        {account ? (
          <div className="account-box">
            <p className="shadow-border">{account}</p>
          </div>
        ) : (
          <button className="btn shadow-border z-[100]" onClick={connectWallet}>
            Connect
          </button>
        )}
        {error && <p>{`Error: ${error}`}</p>}
      </div>
    </header>
*/
