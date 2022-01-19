import { getPreferenceValues, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { cdn } from "tencentcloud-sdk-nodejs";
import { DetailDomain } from "tencentcloud-sdk-nodejs/tencentcloud/services/cdn/v20180606/cdn_models";

interface Preferences {
  secretId: string;
  secretKey: string;
}

export default function Command() {
  const preferences: Preferences = getPreferenceValues();
  const [domains, setDomains] = useState<DetailDomain[]>([]);
  const clientConfig = {
    credential: {
      secretId: preferences.secretId,
      secretKey: preferences.secretKey,
    },
    region: "",
    profile: {
      httpProfile: {
        endpoint: "cdn.tencentcloudapi.com",
      },
    },
  };
  const client = new cdn.v20180606.Client(clientConfig);
  const params = {};

  useEffect(() => {
    async function fetchDomains() {
      client.DescribeDomainsConfig(params).then(
        (data) => {
          setDomains(data.Domains);
        },
        (err) => {
          console.error("error", err);
        }
      );
    }
    fetchDomains();
  }, []);

  return (
    <List>
      {domains.map((domain: DetailDomain) => (
        <List.Item
          key={domain.ResourceId}
          title={domain.Domain}
          subtitle={domain.Https.CertInfo?.ExpireTime ? "valid to: " + domain.Https.CertInfo?.ExpireTime : "-"}
        />
      ))}
    </List>
  );
}
