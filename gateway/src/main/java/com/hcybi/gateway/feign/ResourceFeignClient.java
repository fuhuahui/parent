package com.hcybi.gateway.feign;

import com.hcybi.common.Constant;
import com.hcybi.common.entity.Resource;
import com.hcybi.common.web.entity.RetEntity;
import com.hcybi.gateway.feign.fallback.ResourceFeignClientFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * @author by wenzewoo on 2018/2/4.
 */
@FeignClient(name = Constant.Service.FASTJEE_USERCENTER, fallback = ResourceFeignClientFallback.class)
public interface ResourceFeignClient {

    @GetMapping(value = "/resource/findByRoleCode/{roleCode}")
    RetEntity<List<Resource>> findByRoleCode(@PathVariable("roleCode") String roleCode);
}
