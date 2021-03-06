/*
 * Copyright 2018 吴汶泽(wenzewoo@gmail.com)
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hcybi.common.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import com.baomidou.mybatisplus.enums.IdType;
import com.hcybi.common.entity.base.MpEntity;
import com.hcybi.common.entity.enums.ResourceMethod;
import com.hcybi.common.entity.enums.ResourceType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * 资源信息(菜单&按钮) 实体
 * @author by wenzewoo on 2018-02-06.
 */
@Data
@ToString
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = true)
@TableName("tb_resource")
public class Resource extends MpEntity<Resource> {

    private static final long serialVersionUID = 1L;

	@TableId(value="id", type= IdType.AUTO)
	private Long id;
    //资源编码(规则->菜单名:按钮名 || 菜单名)
	private String code;
    //资源名
	private String name;
    //类型(0菜单,1按钮,2其他)
	private ResourceType type;
    //服务端地址
	private String url;
    //请求方式,GET/POST/DELETE/PUT,NONE(无)
	private ResourceMethod method;
    //优先级(仅作用于当前级别)
	private Integer priority;
    //前端URL
	private String path;
    //Vue组件地址
	private String component;
    //图标
	private String icon;
    //父级ID
	@TableField("parentId")
	private Long parentId;


	@Override
	protected Serializable pkVal() {
		return this.id;
	}

}
