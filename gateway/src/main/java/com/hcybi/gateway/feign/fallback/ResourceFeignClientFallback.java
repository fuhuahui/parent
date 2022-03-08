package com.hcybi.gateway.feign.fallback;

import com.hcybi.common.Constant;
import com.hcybi.common.web.entity.RetEntity;
import com.hcybi.gateway.feign.ResourceFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @author by wenzewoo on 2018/2/4.
 */
@Slf4j
@Component
public class ResourceFeignClientFallback implements ResourceFeignClient {
    @Override
    public RetEntity findByRoleCode(String roleCode) {

        int retCode = Constant.Code.SC_FEIGN_FALLBACK;
        String retMessage = String.format(
            "Feign调用接口失败(from: %s, Method: findByRoleCode, Params: %s)",
            Constant.Service.FASTJEE_USERCENTER, roleCode
        );
        log.error(retMessage);
        return RetEntity.error(retCode, retMessage);
    }
}
